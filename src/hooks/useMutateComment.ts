import { useMutation, useQueryClient } from 'react-query'
import { Comment, EditedComment } from '@/types'
import { supabase } from '@/utils/supabase'

export const useMutateComment = () => {
  const queryClient = useQueryClient()

  const createCommentMutation = useMutation(
    async (comment: Omit<Comment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const createdComment = res?.[0]
        if (!createdComment) return
        queryClient.setQueryData<Comment[]>(
          ['comments', createdComment.post_id],
          (previousComments = []) => {
            const filteredComments = previousComments.filter(
              (comment) => comment.id !== createdComment.id
            )
            return [createdComment, ...filteredComments]
          }
        )
        queryClient.setQueryData<number>(
          ['comment-count', createdComment.post_id],
          (previousCount) => (previousCount ?? 0) + 1
        )
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  const updateCommentMutation = useMutation(
    async (comment: EditedComment) => {
      const { data, error } = await supabase
        .from('comments')
        .update({ comment: comment.comment })
        .eq('id', comment.id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const updatedComment = res?.[0]
        if (!updatedComment) return
        queryClient.setQueryData<Comment[]>(
          ['comments', updatedComment.post_id],
          (previousComments = []) =>
            previousComments.map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment
            )
        )
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  const deleteCommentMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const deletedComment = res?.[0]
        if (!deletedComment) return
        queryClient.setQueryData<Comment[]>(
          ['comments', deletedComment.post_id],
          (previousComments = []) =>
            previousComments.filter(
              (comment) => comment.id !== deletedComment.id
            )
        )
        queryClient.setQueryData<number>(
          ['comment-count', deletedComment.post_id],
          (previousCount) => Math.max((previousCount ?? 0) - 1, 0)
        )
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  }
}
