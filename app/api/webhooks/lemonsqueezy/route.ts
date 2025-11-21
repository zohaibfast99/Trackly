import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventName = event.meta.event_name;
    const eventData = event.data;

    console.log("LemonSqueezy webhook received:", eventName);

    switch (eventName) {
      case "subscription_created":
        await handleSubscriptionCreated(eventData);
        break;
      
      case "subscription_updated":
        await handleSubscriptionUpdated(eventData);
        break;
      
      case "subscription_cancelled":
        await handleSubscriptionCancelled(eventData);
        break;
      
      case "subscription_resumed":
        await handleSubscriptionResumed(eventData);
        break;
      
      case "subscription_expired":
        await handleSubscriptionExpired(eventData);
        break;
      
      case "subscription_paused":
        await handleSubscriptionPaused(eventData);
        break;
      
      case "subscription_unpaused":
        await handleSubscriptionUnpaused(eventData);
        break;

      case "order_created":
        await handleOrderCreated(eventData);
        break;

      default:
        console.log(`Unhandled webhook event: ${eventName}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleSubscriptionCreated(data: any) {
  try {
    const userId = data.attributes.custom_data?.user_id;
    if (!userId) {
      console.error("No user_id in subscription created webhook");
      return;
    }

    const plan = getPlanFromVariantId(data.attributes.variant_id);
    
    await db.subscription.upsert({
      where: { userId },
      create: {
        userId,
        lemonsqueezyId: data.id,
        plan,
        status: "ACTIVE",
        currentPeriodEnd: new Date(data.attributes.renews_at),
        frequency: data.attributes.billing_anchor === 12 ? "yearly" : "monthly",
        customerId: data.attributes.customer_id,
        orderId: data.attributes.order_id,
      },
      update: {
        lemonsqueezyId: data.id,
        plan,
        status: "ACTIVE",
        currentPeriodEnd: new Date(data.attributes.renews_at),
        frequency: data.attributes.billing_anchor === 12 ? "yearly" : "monthly",
        customerId: data.attributes.customer_id,
        orderId: data.attributes.order_id,
        cancelAtPeriodEnd: false,
      },
    });
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  try {
    const subscriptionId = data.id;
    
    await db.subscription.updateMany({
      where: { lemonsqueezyId: subscriptionId },
      data: {
        status: mapLemonSqueezyStatus(data.attributes.status),
        currentPeriodEnd: new Date(data.attributes.renews_at),
        cancelAtPeriodEnd: data.attributes.cancelled,
      },
    });
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

async function handleSubscriptionCancelled(data: any) {
  try {
    const subscriptionId = data.id;
    
    await db.subscription.updateMany({
      where: { lemonsqueezyId: subscriptionId },
      data: {
        status: "CANCELLED",
        cancelAtPeriodEnd: true,
      },
    });
  } catch (error) {
    console.error("Error handling subscription cancelled:", error);
  }
}

async function handleSubscriptionResumed(data: any) {
  try {
    const subscriptionId = data.id;
    
    await db.subscription.updateMany({
      where: { lemonsqueezyId: subscriptionId },
      data: {
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
      },
    });
  } catch (error) {
    console.error("Error handling subscription resumed:", error);
  }
}

async function handleSubscriptionExpired(data: any) {
  try {
    const subscriptionId = data.id;
    
    await db.subscription.updateMany({
      where: { lemonsqueezyId: subscriptionId },
      data: {
        status: "EXPIRED",
        plan: "FREE",
      },
    });
  } catch (error) {
    console.error("Error handling subscription expired:", error);
  }
}

async function handleSubscriptionPaused(data: any) {
  try {
    const subscriptionId = data.id;
    
    await db.subscription.updateMany({
      where: { lemonsqueezyId: subscriptionId },
      data: {
        status: "CANCELLED",
      },
    });
  } catch (error) {
    console.error("Error handling subscription paused:", error);
  }
}

async function handleSubscriptionUnpaused(data: any) {
  try {
    const subscriptionId = data.id;
    
    await db.subscription.updateMany({
      where: { lemonsqueezyId: subscriptionId },
      data: {
        status: "ACTIVE",
      },
    });
  } catch (error) {
    console.error("Error handling subscription unpaused:", error);
  }
}

async function handleOrderCreated(data: any) {
  try {
    const userId = data.attributes.custom_data?.user_id;
    if (!userId) return;

    // Update subscription with order information
    await db.subscription.updateMany({
      where: { userId },
      data: {
        orderId: data.id,
        customerId: data.attributes.customer_id,
      },
    });
  } catch (error) {
    console.error("Error handling order created:", error);
  }
}

function getPlanFromVariantId(variantId: string): "FREE" | "PRO" | "ENTERPRISE" {
  const PRO_VARIANTS = [
    process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID,
    process.env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID,
  ];
  
  const ENTERPRISE_VARIANTS = [
    process.env.LEMONSQUEEZY_ENTERPRISE_MONTHLY_VARIANT_ID,
    process.env.LEMONSQUEEZY_ENTERPRISE_YEARLY_VARIANT_ID,
  ];

  if (PRO_VARIANTS.includes(variantId)) {
    return "PRO";
  } else if (ENTERPRISE_VARIANTS.includes(variantId)) {
    return "ENTERPRISE";
  }
  
  return "FREE";
}

function mapLemonSqueezyStatus(status: string): "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE" {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "cancelled":
      return "CANCELLED";
    case "expired":
      return "EXPIRED";
    case "past_due":
      return "PAST_DUE";
    default:
      return "CANCELLED";
  }
}