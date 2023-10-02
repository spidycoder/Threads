import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}
const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <>
      <div
        className={`flex w-full flex-col rounded-xl p-6 ${
          isComment ? "px-0 xs:px-7" : "bg-dark-2 "
        }`}
      >
        <div className="flex item-start justify-between">
          <div className="flex w-full flex-1 flex-row gap-4">
            <div className="flex flex-row item-center">
              <Link
                href={`/profile/${author.id}`}
                className="relative h-11 w-11"
              >
                <Image
                  src={author.image}
                  alt="profile_photo"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </Link>
              <div className="thread-card bar" />
            </div>
            <div className="flex flex-col w-full">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-2">
                  {author.name}
                </h4>
              </Link>
              <p className="mt-2 text-light-2 text-medium-regular">{content}</p>
              {/* showing the images for reaction on a post  */}
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Image
                    src="/heart-gray.svg"
                    alt="heart-image"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <Link href={`/thread/${id}`}>
                    <Image
                      src="/reply.svg"
                      alt="reply-image"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                  <Image
                    src="/repost.svg"
                    alt="repost"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <Image
                    src="/share.svg"
                    alt="share"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </div>
                {isComment && comments.length && (
                  <Link href={`/thread/${id}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      {comments.length} replies
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadCard;
