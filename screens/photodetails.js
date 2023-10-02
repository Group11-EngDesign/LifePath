import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const PhotoDetails = ({ route }) => {
  const { photo } = route.params;
  const [comment, setComment] = useState(''); // State to store user comments
  const [comments, setComments] = useState([]); // State to store all comments

  // Function to handle adding a comment
  const handleAddComment = () => {
    if (comment.trim() !== '') {
      setComments([...comments, comment]); // Add the comment to the comments list
      setComment(''); // Clear the input field
    }
  };

  // Function to handle removing a comment
  const handleRemoveComment = (index) => {
    const updatedComments = [...comments];
    updatedComments.splice(index, 1); // Remove the comment at the specified index
    setComments(updatedComments);
  };

  console.log('Photo:', photo); // Checking if photo is being passed

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
      <TouchableOpacity onPress={() => handleRemoveComment(index)} style={styles.removeButton}>
        <Icon name="trash-o" size={18} color="" />
      </TouchableOpacity>
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
  },
  photo: {
    width: '100%',
    height: 400,
    margin: 5,
  },
  commentsContainer: {
    maxHeight: 150,
    width: '100%',
  },
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
  },
  commentText: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
  },
  commentInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
  commentButton: {
    marginTop: 10,
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
