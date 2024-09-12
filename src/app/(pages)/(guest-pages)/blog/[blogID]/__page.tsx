import WithNavLayout from "@/components/layouts/withNavBar";
import React from "react";
import WithTitleLayout from "@/components/layouts/withTitle";

export default function BlogPage({ params }: { params: any }) {
  return (
    <WithNavLayout>
      <WithTitleLayout
        title="Blog"
        description="Where we share thoughts, sentiments and knowledge"
      >
        {/* <BlogPost /> */}
        <></>
      </WithTitleLayout>
    </WithNavLayout>
  );
}
