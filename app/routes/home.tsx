import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import { UsernameForm } from "~/components/username-form";
import { TypingDataGrid } from "~/components/typing-data-grid";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Boards" },
    { description: "Manage create, view, and manage boards" },
  ];
}

const useFetchBoardsByUsernameList = (usernames: { value: string }[]) => {
  const [data, setData] = useState<any>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(
    null,
  );

  const fetchBoards = async () => {
    setStatus("loading");
    try {
      const data = await Promise.all(
        usernames.map(async ({ value: username }) => {
          const response = await fetch(
            `https://api.monkeytype.com/users/${username}/profile?isUid=false`,
          );
          const data = (await response.json()) as {
            data: Record<string, unknown>;
          };
          return data?.data;
        }),
      );
      console.log("fetched data: ", data);
      setData(data);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };
  useEffect(() => {
    fetchBoards();
  }, [usernames]);

  return {
    data,
    isLoading: status === "loading",
    error: status === "error",
    success: status === "success",
    refetch: fetchBoards,
  };
};

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const usernames = useMemo(() => {
    try {
      const users = JSON.parse(searchParams.get("users") || "[]");
      return users.map((user: string) => ({ value: user.toLowerCase() }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [searchParams]);
  const { data, isLoading, error } = useFetchBoardsByUsernameList(usernames);
  console.log(data);
  return (
    <section>
      <UsernameForm setSearchParams={setSearchParams} usernames={usernames} />
      <div className="mb-15"></div>
      {!!data.length && !error && !isLoading && (
        <TypingDataGrid sampleData={data} />
      )}
    </section>
  );
}
