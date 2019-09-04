import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Image } from 'react-native';


export default class App extends Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photo: '',
    camera: false
  };

  // Function for open camera
  openCamera = async () =>{
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') this.setState({ hasCameraPermission: true, isCamera: true, photo: '' });
    else this.setState({ hasCameraPermission: false, isCamera: false });
  }

  // Function for capture picture 
  snap = async () => {
      let photo = await this.camera.takePictureAsync();
      this.setState({ photo: photo.uri, isCamera: false })
  }

  render() {
    console.log('ImageUri----->', this.state.photo);

    const { hasCameraPermission } = this.state;
      return (
        <View style={{ flex: 1 }}>
          {!hasCameraPermission && 
            <View style={{flex: 1, alignItems: 'center' , justifyContent: 'center'}}>
              <Text style={{fontSize: 18}}>No Access To Camera</Text>
            </View>
          }
          {!this.state.isCamera && 
          <TouchableOpacity 
            style={{flex: 0.3, alignItems: 'center' , justifyContent: 'center'}}
            onPress={this.openCamera}
            >
            <Text style={{ backgroundColor: '#e74c3c' , color: '#fff' , padding: 8 , fontSize: 18, borderRadius: 10}}>Open Camera</Text>
          </TouchableOpacity>
          }

          {/* Camera Container */}
          {!!this.state.isCamera &&
            <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => {
              this.camera = ref;
            }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0.5,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                    });
                  }}>
                  <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.snap}
                  style={{
                    flex: 0.5,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Capture</Text>
                </TouchableOpacity>
              </View>
            </Camera>
          }

          {!this.state.camera && !!this.state.photo &&
            <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                style={{ width: 300, height: 300 }}
                source={{ uri: this.state.photo }}
              />
            </View>
          }
        </View>
      );
  }
}
