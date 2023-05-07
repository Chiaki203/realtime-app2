import { useMutation } from 'react-query';
import { supabase } from '@/utils/supabase';
import { Comment, EditedComment } from '@/types';

export const useMutateComment = () => {
  const createCommentMutation = useMutation(async(comment:Omit<Comment, 'id' | 'created_at'>) => {
    const {data, error} = await supabase
      .from('comments')
      .insert(comment)
      .select()
    if (error) throw new Error(error.message)
    console.log('createCommentMutation supabase data', data)
    return data
  }, {
    onError: (err:any) => {
      alert(err.message)
    }
  })
  const updateCommentMutation = useMutation(async(comment:EditedComment) => {
    const {data, error} = await supabase
      .from('comments')
      .update({comment: comment.comment})
      .eq('id', comment.id)
      .select()
    if (error) throw new Error(error.message)
    console.log('updateCommentMutation supabase data', data)
    return data
  }, {
    onError: (err:any) => {
      alert(err.message)
    }
  })
  const deleteCommentMutation = useMutation(async(id:string) => {
    const {data, error} = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .select()
    if (error) throw new Error(error.message)
    console.log('deleteCommentMutation supabase data', data)
    return data
  }, {
    onError: (err:any) => {
      alert(err.message)
    }
  }) 
  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation
  }
}