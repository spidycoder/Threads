"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectDB } from "../moongose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

//to define the type of the params used in updateUser function
interface Params {
  userId: string;
  username: string;
  bio: string;
  name: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  bio,
  name,
  image,
  path,
}: Params): Promise<void> {
  connectDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        bio: bio,
        name: name,
        image: image,
        onboard: true,
      },
      //to update+insert into database
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to update the profile ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPost(userId: string) {
  try {
    connectDB();
    //todo:Populate threads
    const posts = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return posts;
  } catch (error: any) {
    throw new Error(`Failed to Fetch User's Post: ${error.message}`);
  }
}

export async function searchUser({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder;
}) {
  try {
    connectDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    /*  "i": This is an optional second argument that you can pass to the RegExp constructor. In this context,
     *  "i" stands for "case-insensitive." When you include "i" as the second argument,
     *  it means that the regular expression will not consider the case of letters when making matches. For example,
     *  if you search for "apple" with the "i" flag, it will match "apple," "Apple," "aPpLe," and so on.
     */
    const regex = new RegExp(searchString, "i");
    //using above regex,we will start searching in database

    //getting the current user from userId
    const query: FilterQuery<typeof User> = {
      id: {
        $ne: userId,
      },
    };
    //after filtering that user,search for it's name or username
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalUserCount = await User.countDocuments(query);
    const users = await userQuery.exec();
    const isNext = totalUserCount > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to Fetch User's Profile: ${error.message}`);
  }
}


//this function returns all the comments recieved on a post for a particular user's posts
export async function getActivity(userId: string) {
  try {
    connectDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}
