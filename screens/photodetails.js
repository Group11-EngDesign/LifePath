import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const PhotoDetails = ({ route }) => {
  const { photo } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);

  const handleAddComment = () => {
    if (comment.trim() !== '') {
      
      if (replyTo !== null) {
        const updatedComments = [...comments];
        updatedComments[replyTo] = `${updatedComments[replyTo]}\nPictuReel Reply: ${comment}`;
        setComments(updatedComments);
        setReplyTo(null);
      } else {
        setComments([...comments, `User: ${comment}`]);
      }
      setComment('');
    }
  };

  const handleReply = (index) => {
    setReplyTo(index);
  };

  const handleRemoveComment = (index) => {
    const updatedComments = [...comments];
    updatedComments.splice(index, 1);
    setComments(updatedComments);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photo.metadata.smallImageUrl }}
        style={styles.photo}
        onError={(error) => console.error('Image Error:', error.nativeEvent)}
      />

      <Text>{photo.author}</Text>
      <Text>{photo.width} x {photo.height}</Text>

      <ScrollView style={styles.commentsContainer}>
        {comments.map((commentText, index) => (
          <View key={index} style={styles.commentContainer}>
            <Text style={styles.commentText}>{commentText}</Text>
            <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => handleReply(index)} style={styles.replyButton}>
                <Icon name="reply" size={18} color="#7bb956" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemoveComment(index)} style={styles.removeButton}>
               <Icon name="trash-o" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={styles.commentInput}
        placeholder="Add a comment..."
        value={comment}
        onChangeText={(text) => setComment(text)}
      />
      <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
        <Text style={styles.commentButtonText}>Add Comment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white',
    
  },
  photo: {
    width: '50%',
    height: 200,
    marginTop: 50,
    borderRadius: 20,
  },
  commentsContainer: {
    width: '100%',
    flex: 1, // Ensure the ScrollView takes up all available space
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
  },
  commentText: {
    flex: 1,
  },
  commentActions: {
    flexDirection: 'row',
  },
  replyButton: {
    marginRight: 10,
  },
  replyButtonText: {
    color: 'green',
  },
  removeButton: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  commentInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentButton: {
    marginBottom: 200,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default PhotoDetails;