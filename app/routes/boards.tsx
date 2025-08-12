import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/boards";
import UsernameForm from "~/components/username-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Boards" },
    { description: "Manage create, view, and manage boards" },
  ];
}

const useTryCatch = (callback: () => Promise<any>) => {
  const [value, setValue] = useState<any>();
  useEffect(() => {
    const value = callback();
    if (value instanceof Promise) {
      value.then(setValue).catch(console.error);
    } else {
      setValue(value);
    }
  }, [callback]);
  return value;
};

export default function Boards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parseUsers = useCallback(() => {
    try {
      const users = JSON.parse(searchParams.get("users") || "[]");
      return users.map((user: string) => ({ value: user.toLowerCase() }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [searchParams]);
  const usernames = useTryCatch(parseUsers);
  const showTable = usernames?.length > 0;
  console.log("usernames: ", usernames);
  return (
    <>
      <UsernameForm setSearchParams={setSearchParams} usernames={usernames} />
      {showTable && <div>table goes here</div>}
    </>
  );
}
