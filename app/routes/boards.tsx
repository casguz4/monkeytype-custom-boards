import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/boards";
import UsernameForm from "~/components/username-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Boards" },
    { description: "Manage create, view, and manage boards" },
  ];
}

export default function Boards() {
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

  const showTable = usernames?.length > 0;
  console.log("usernames: ", usernames);
  return (
    <>
      <UsernameForm setSearchParams={setSearchParams} usernames={usernames} />
      {showTable && (
        <div>
          <pre>
            <code>{JSON.stringify(usernames, null, 2)}</code>
          </pre>
        </div>
      )}
    </>
  );
}
