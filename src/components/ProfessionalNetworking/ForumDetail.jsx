import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {ArrowLeft, User, Clock, Heart, Share2, MessageCircle, Send, AlertCircle, Loader,Eye,Reply} from 'lucide-react';
import { apiService, getUserDisplayName } from './apiServiceForum';

const ForumDetail = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  
  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [message, setMessage] = useState(''); // For showing user messages

  // Load current user
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadCurrentUser();
  }, []);

  // Load forum and comments
  useEffect(() => {
    if (forumId) {
      loadForumData();
      loadComments();
    }
  }, [forumId]);

  const loadForumData = async () => {
    try {
      setLoading(true);
      setError(null);
      const forumData = await apiService.getForum(forumId);
      setForum(forumData);
    } catch (error) {
      setError('Failed to load forum post.');
      console.error('Error loading forum:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const commentsData = await apiService.getComments(forumId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleLike = async () => {
    if (!currentUser) {
      showMessage('You must be logged in to like posts.', 'error');
      return;
    }

    try {
      await apiService.toggleLike(forumId);
      
      // Update the forum in local state
      setForum(prev => ({
        ...prev,
        likes: (prev.likes || 0) + (prev.isLiked ? -1 : 1),
        isLiked: !prev.isLiked
      }));

      showMessage(forum.isLiked ? 'Post unliked' : 'Post liked', 'success');
    } catch (error) {
      console.error('Error liking forum:', error);
      showMessage('Failed to update like status.', 'error');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      showMessage('Please enter a comment before submitting.', 'error');
      return;
    }

    if (!currentUser) {
      showMessage('You must be logged in to comment.', 'error');
      return;
    }

    setSubmittingComment(true);

    try {
      const commentData = {
        content: newComment.trim(),
        parent_comment_id: replyingTo
      };

      const createdComment = await apiService.addComment(forumId, commentData);
      
      // Add the new comment to the list
      setComments(prev => [...prev, createdComment]);
      
      // Reset form
      setNewComment('');
      setReplyingTo(null);

      showMessage('Your comment has been posted successfully.', 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      showMessage('Failed to add comment. Please try again.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      showMessage('You must be logged in to like comments.', 'error');
      return;
    }

    try {
      await apiService.toggleCommentLike(forumId, commentId);
      
      // Update the comment in local state
      setComments(prev => prev.map(comment => 
        comment.id === commentId
          ? { 
              ...comment, 
              likes: (comment.likes || 0) + (comment.isLiked ? -1 : 1),
              isLiked: !comment.isLiked 
            }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      career: 'bg-blue-100 text-blue-700',
      mentorship: 'bg-green-100 text-green-700', 
      events: 'bg-orange-100 text-orange-700',
      technical: 'bg-red-100 text-red-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Organize comments by parent/child relationship
  const organizeComments = (comments) => {
    const parentComments = comments.filter(comment => !comment.parent_comment_id);
    const childComments = comments.filter(comment => comment.parent_comment_id);
    
    return parentComments.map(parent => ({
      ...parent,
      replies: childComments.filter(child => child.parent_comment_id === parent.id)
    }));
  };

  const organizedComments = organizeComments(comments);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading forum post...</span>
        </div>
      </div>
    );
  }

  if (error || !forum) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Forum</h2>
          <p className="text-muted-foreground mb-4">{error || 'Forum post not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Return to Forums
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Message Display */}
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          message.includes('error') || message.includes('Failed') || message.includes('must be')
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Discussion Forum</h1>
        </div>

        {/* Forum Post */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {forum.title}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(forum.category)}`}>
                    {forum.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {getUserDisplayName(forum)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(forum.createdAt || forum.created_at)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-card-foreground whitespace-pre-wrap">
                {forum.content}
              </p>
            </div>
            
            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {forum.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {comments.length}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {forum.likes || 0}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleLike}
                  disabled={!currentUser}
                  className={`p-2 rounded transition-colors ${
                    forum.isLiked 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                  } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                  title={!currentUser ? 'Please log in to like posts' : 'Like this post'}
                >
                  <Heart className={`w-4 h-4 ${forum.isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          {currentUser && (
            <div className="bg-card rounded-lg border p-4 mb-6">
              <div className="space-y-3">
                {replyingTo && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Reply className="w-4 h-4" />
                    Replying to comment
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-primary hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyingTo ? "Write your reply..." : "Join the discussion..."}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={3}
                  disabled={submittingComment}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {newComment.length}/500 characters
                  </span>
                  <button
                    onClick={handleAddComment}
                    disabled={submittingComment || !newComment.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submittingComment && <Loader className="w-4 h-4 animate-spin" />}
                    <Send className="w-4 h-4" />
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!currentUser && (
            <div className="bg-muted rounded-lg p-4 mb-6 text-center">
              <p className="text-muted-foreground">
                Please log in to join the discussion and post comments.
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading comments...</span>
            </div>
          ) : organizedComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet.</p>
              <p className="text-sm">Be the first to join the discussion!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {organizedComments.map((comment) => (
                <div key={comment.id} className="bg-card rounded-lg border p-4">
                  {/* Main Comment */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {getUserDisplayName(comment)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground mb-2 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          disabled={!currentUser}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                            comment.isLiked 
                              ? 'text-red-600 bg-red-50' 
                              : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                          } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                          {comment.likes || 0}
                        </button>
                        {currentUser && (
                          <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-muted transition-colors"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 mt-3 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs">
                                  {getUserDisplayName(reply)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-card-foreground mb-1 whitespace-pre-wrap">
                                {reply.content}
                              </p>
                              <button
                                onClick={() => handleLikeComment(reply.id)}
                                disabled={!currentUser}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                                  reply.isLiked 
                                    ? 'text-red-600 bg-red-50' 
                                    : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                                } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                              >
                                <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                {reply.likes || 0}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;