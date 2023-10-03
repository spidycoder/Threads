import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getActivity } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboard");

  const activites = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text">Activity</h1>
      {/* iterating over all the comments and showing them by using map */}
      <section className="mt-10 flex flex-col gap-5">
        {activites.length > 0 ? (
          <>
            {activites.map((acitivity) => (
              <Link href={`/thread/${acitivity.parentId}`} key={acitivity._id}>
                <article className="activity-card">
                  <Image
                    src={acitivity.author.image}
                    alt="profile-pic"
                    height={24}
                    width={24}
                    className="rounded-full"
                  />

                  
                  <p className="text-light-1">
                    <span className="mr-1 text-primary-500">
                      {acitivity.author.name}
                    </span>{"  "}
                    replied to Your Post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-light-2">No Activity Yet</p>
        )}
      </section>
    </section>
  );
}

export default Page;
