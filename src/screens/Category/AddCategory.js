import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const AddCategory = ({navigation}) => {
  return (
    <View>
      <Text>AddCategory</Text>
      <TouchableOpacity onPress={() => navigation.navigate("IconCategory")}><Text>Biểu tượng danh mục</Text></TouchableOpacity>
    </View>
  )
}

export default AddCategory

const styles = StyleSheet.create({})