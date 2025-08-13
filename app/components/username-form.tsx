import { Plus, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormData = {
  usernames: { value: string }[];
};

interface Props {
  usernames: { value: string }[];
  setSearchParams: (params: URLSearchParams | string) => void;
}
export function UsernameForm({ usernames, setSearchParams }: Props) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      usernames: usernames ?? [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "usernames",
  });

  const onSubmit = (data: FormData) => {
    const validUsernames = [
      ...new Set( // remove duplicates
        data.usernames
          .map((item) => item.value.trim())
          .filter((username) => username.length > 0)
      ),
    ];
    const params = new URLSearchParams([
      ["users", JSON.stringify(validUsernames)],
    ]);
    setSearchParams(params);
  };

  return (
    <div className="p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-sans">Username Entry Form</CardTitle>
          <CardDescription>
            Add multiple usernames using the form below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Usernames</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      {...register(`usernames.${index}.value`, {
                        required:
                          index === 0
                            ? "At least one username is required"
                            : false,
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9_-]+$/,
                          message:
                            "Username can only contain letters, numbers, hyphens, and underscores",
                        },
                        validate: {
                          userExists: async (value) => {
                            const DNE = `The username ${value} does not exist`;
                            try {
                              const response = await fetch(
                                `https://api.monkeytype.com/users/${value}/profile?isUid=false`
                              );
                              if (!response.ok) {
                                return DNE;
                              }
                              const data = (await response.json()) as {
                                data: UserProfile;
                                message: string;
                              };
                              if (!data.data.uid) {
                                return data.message;
                              }
                              return true;
                            } catch {
                              return DNE;
                            }
                          },
                        },
                      })}
                      placeholder={`Username ${index + 1}`}
                      className="w-full"
                    />
                    {errors.usernames?.[index]?.value && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.usernames[index]?.value?.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ value: "" })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Username
            </Button>

            <Button type="submit" className="w-full">
              Submit Usernames
            </Button>
            <div className="hidden">
              <DevTool control={control} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
