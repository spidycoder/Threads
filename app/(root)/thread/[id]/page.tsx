import ThreadCard from "@/components/cards/ThreadCard";
import Comments from "@/components/forms/Comments";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//to get the id from params of url,follow this appraoch
const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboard");
  const thread = await fetchThreadById(params.id);
  return (
    <section className="relative">
      {/* displaying the comment feature */}
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user.id}
          content={thread.text}
          parentId={user.id}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      {/* multi-level comment feature */}
      <div className="mt-7">
        <Comments
          threadId={thread.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {/* childre of thread is all comments added to that particular thread*/}
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            content={childItem.text}
            parentId={user.id}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};
export default Page;
