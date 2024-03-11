import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react'
import './index.scss'
import leftIcon from "../../assets/left.png";

class NavCustomBar extends Component {

    constructor(props){
        super(props)
        this.state={
            navBarHeight:0,
        }
    }

    componentWillMount () {
        this.getNavHeight()
    }

    getNavHeight(){
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        // console.log('wx.getMenuButtonBoundingClientRect()',menuButtonObject)
        var sysinfo = wx.getSystemInfoSync();
        // console.log('wx.getSystemInfoSync()',sysinfo)
        let statusBarHeight = sysinfo.statusBarHeight;
        let menuBottonHeight =  menuButtonObject.height;
        let menuBottonTop =  menuButtonObject.top;
        let navBarHeight = statusBarHeight + menuBottonHeight + (menuBottonTop - statusBarHeight) * 2 ;
        // console.log(navBarHeight)

        this.setState({
            navBarHeight,
        })
    }

    goBackPage(){
        Taro.navigateBack({
            delta: 1
        })
    }

    render () {
        let { needBackIcon=true, mainTitle='' } = this.props
        return (
            <View className='nav_custom_bar' style={{height:` ${this.state.navBarHeight}px`}}>
                <View className={`nav_custom_bar_back ${needBackIcon?'':'hidden'}`} onClick={()=>{this.goBackPage()}}>
                    <img src={leftIcon} className={"bak-img"}/>
                </View>
                <Text className='nav_custom_bar_title'>{mainTitle}</Text>
                <View></View>
            </View>
        )
    }
}
export default NavCustomBar;