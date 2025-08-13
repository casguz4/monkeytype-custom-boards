import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const TAB_LABELS = ["Profile", "Time", "Typing"];
const TABS = TAB_LABELS.map((label) => ({ value: label.toLowerCase(), label }));

export function RankingTabs({ userData }: { userData: UserProfile[] }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue={TABS[0].value}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <RankingCard title={tab.label} userData={userData} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

type RankingCardProps = {
  title: string;
  userData: UserProfile[];
};

function RankingCard({ title, userData }: RankingCardProps) {
  const key = title.toLowerCase();
  const sortedUsers = userData.toSorted((a: UserProfile, b: UserProfile) => {
    switch (key) {
      case "profile":
        return a.xp - b.xp;
      case "time":
        return (
          a.personalBests.time["15"].toSorted((a, b) => a.wpm - b.wpm)[0].wpm -
          b.personalBests.time["15"].toSorted((a, b) => a.wpm - b.wpm)[0].wpm
        );
      case "typing":
        return a.typingStats.timeTyping - b.typingStats.timeTyping;
      default:
        return 0;
    }
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {sortedUsers.map((user) => (
          <div key={user.uid} className="grid gap-3">
            <Label>{user.name}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
