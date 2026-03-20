import { FC, useState } from 'react'
import { useQueryPosts } from '@/hooks/useQueryPosts'
import { useSubscribeCommentCounts } from '@/hooks/useSubscribeCommentCounts'
import { useSubscribePosts } from '@/hooks/useSubscribePosts'
import { PostForm } from './PostForm'
import { PostItem } from './PostItem'

export const Feed: FC = () => {
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const { data: posts } = useQueryPosts()

  useSubscribePosts()
  useSubscribeCommentCounts()

  return (
    <div className="flex w-full flex-col items-center justify-center pt-4 md:px-4">
      <p className="mb-4 hidden text-center text-lg md:block">Feed</p>
      <PostForm />
      <ul data-testid="ul-post" className="w-full">
        {posts?.map((post) => (
          <PostItem
            key={post.id}
            id={post.id}
            title={post.title}
            post_url={post.post_url}
            user_id={post.user_id}
            isEditing={editingPostId === post.id}
            startEditing={() => setEditingPostId(post.id)}
            stopEditing={() => setEditingPostId(null)}
          />
        ))}
      </ul>
    </div>
  )
}
