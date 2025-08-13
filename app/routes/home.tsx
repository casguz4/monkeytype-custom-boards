import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";

import { TypingDataGrid } from "~/components/typing-data-grid";
import { UsernameForm } from "~/components/username-form";

// eslint-disable-next-line react-refresh/only-export-components
export function meta() {
  return [
    { title: "Boards" },
    { description: "Manage create, view, and manage boards" },
  ];
}

const useFetchBoardsByUsernameList = (usernames: { value: string }[]) => {
  const [data, setData] = useState<UserProfile[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(
    null
  );

  const fetchBoards = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await Promise.all(
        usernames.map(async ({ value: username }) => {
          const response = await fetch(
            `https://api.monkeytype.com/users/${username}/profile?isUid=false`
          );
          const data = (await response.json()) as {
            data: UserProfile;
          };
          return data.data;
        })
      );
      setData(data);
      setStatus("success");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setStatus("error");
    }
  }, [usernames]);

  useEffect(() => {
    fetchBoards();
  }, [usernames, fetchBoards]);

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
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  }, [searchParams]);
  const { data, isLoading, error } = useFetchBoardsByUsernameList(usernames);
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
