import { fetchUserPost } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "./ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
const ThreadTab = async ({ currentUserId, accountId, accountType }: Props) => {
  //TODO: write a function to fetch thread of particular profile
  let result = await fetchUserPost(accountId);
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId} //todo for other users
          content={thread.text}
          parentId={accountId}
          //using ternary operator to display currentUser's profile or other user's profile
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community} //todo for other communities
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};
export default ThreadTab;
