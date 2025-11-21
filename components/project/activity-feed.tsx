import { formatDistanceToNow } from "date-fns";
import { ProfileAvatar } from "../profile-avatar";

export interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
  user: {
    name: string;
    image: string | null;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="space-y-2">
      {activities?.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-4 rounded-xl  bg-card p-2 shadow-md transition-all duration-200  hover:bg-muted/40"
        >
          <ProfileAvatar
            url={activity.user.image || undefined}
            name={activity.user.name}
            numOfChars={2}
            size="lg"
          />

          <div className="flex flex-col gap-1">
            <p className="text-sm leading-snug">
              <span className="font-semibold">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.description}</span>
            </p>

            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
