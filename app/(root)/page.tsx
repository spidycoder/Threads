import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPost } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPost(1, 30);
  const user = await currentUser();
  if (!user) return null;
  return (
    <>
      <h1 className="head-text" style={{ color: "white" }}>
        Home
      </h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.map((post) => (
          <ThreadCard
            key={post._id}
            id={post._id}
            currentUserId={user.id}
            content={post.text}
            parentId={user.id}
            author={post.author}
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
          />
        ))}
      </section>
    </>
  );
}
