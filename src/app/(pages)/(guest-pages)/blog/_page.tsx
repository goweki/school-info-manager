"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import ObjectID from "bson-objectid";
import { dateShort, truncateStr } from "@/lib/utils";
import { DataContext } from "@/components/mols/providers";
import { Media } from "@prisma/client";

export default function Blog() {
  const {
    data, // refreshData,
  } = useContext(DataContext);

  const { media } = data || [];

  const [blogposts, setPosts] = useState<Media[] | null>(null);

  useEffect(() => {
    if (media) {
      setPosts(
        media
          .filter(({ type }: { type: string }) => type === "BLOGPOST")
          .map((blogpost_: { [key: string]: any }) => ({
            ...blogpost_,
            // date: new ObjectId(blogpost_.id).getTimestamp(),
          }))
      );
    }
  }, [media]);

  return (
    <div className="mx-4 flex flex-wrap">
      {/* Blogposts */}
      {blogposts && blogposts?.length > 0 ? (
        blogposts.map(({ image, id, title, content }, i) => (
          <div key={i} className="md:w-1/2 lg:w-1/3 p-4">
            <BlogCard
              image={image}
              objId={id}
              // date={dateShort(new ObjectId(id).getTimestamp())}
              // date={new ObjectId(id).toString()}
              cardTitle={title}
              cardDescription={truncateStr(content, 80)}
            />
          </div>
        ))
      ) : (
        <p className="italic">
          Oops! No blogposts for now. Check back in later{" "}
        </p>
      )}
    </div>
  );
}

const BlogCard = ({
  image,
  objId,
  cardTitle,
  cardDescription,
}: {
  image: string;
  objId: string;
  cardTitle: string;
  cardDescription: string;
}) => {
  //render
  return (
    <Link
      href={`/blog/${objId}`}
      scroll={false}
      className="block w-full p-4 bg-card rounded hover:bg-popover cursor-pointer h-fit border border-border"
    >
      <div className="mb-8 w-full">
        <div className="mb-8 overflow-hidden rounded">
          <img src={image} alt="" className="w-full" />
        </div>
        <div className="flex flex-col">
          {objId && (
            <span className="inline-block opacity-50 text-xs font-semibold leading-loose">
              {dateShort(ObjectID(objId).getTimestamp())}
            </span>
          )}
          <h3 className="mb-2 inline-block text-xl font-semibold sm:text-2xl lg:text-xl xl:text-2xl">
            {cardTitle}
          </h3>
          <p className="text-sm">{cardDescription}</p>
        </div>
      </div>
    </Link>
  );
};

// const blogPosts = [
//   {
//     date: "Dec 22, 2023",
//     title: "Meet AutoManage, the best AI management tools",
//     content:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     image: "https://placehold.co/600x400",
//   },
//   {
//     date: "Dec 22, 2023",
//     title: "Meet AutoManage, the best AI management tools",
//     content:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     image: "https://placehold.co/600x400",
//   },
//   {
//     date: "Dec 22, 2023",
//     title: "Meet AutoManage, the best AI management tools",
//     content:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     image: "https://placehold.co/600x400",
//   },
// ];
