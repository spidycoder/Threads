import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, searchUser } from "@/lib/actions/user.actions";
import UsersCard from "@/components/cards/UsersCard";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboard");

  //fetching  the user's profile for user.id
  const result = await searchUser({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mt-10">Search</h1>
      <div className="mt-12 flex flex-col gap-9">
        {result.users.length == 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UsersCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                userType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
export default Page;
