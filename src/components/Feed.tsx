import { FC } from 'react'
import { useQueryPosts } from '@/hooks/useQueryPosts'
import { useSubscribeCommentCounts } from '@/hooks/useSubscribeCommentCounts'
import { useSubscribePosts } from '@/hooks/useSubscribePosts'
import { PostItem } from './PostItem'
import { PostForm } from './PostForm'

export const Feed: FC = () => {
  const { data: posts } = useQueryPosts()
  useSubscribePosts()
  useSubscribeCommentCounts()
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 pt-4 md:px-8">
      <p className="mb-4 hidden text-center md:block">Feed</p>
      <PostForm />
      <ul data-testid="ul-post" className="my-5 w-full">
        {posts?.map((post) => (
          <PostItem
            key={post.id}
            id={post.id}
            title={post.title}
            post_url={post.post_url}
            user_id={post.user_id}
          />
        ))}
      </ul>
    </div>
  )
}
