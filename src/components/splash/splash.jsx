import React, {useEffect, useRef, useState} from 'react'
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import logo from '../../assets/logo.png'; // 替换为您的 logo 图片路径
import './splash.scss';

const Splash = () => {
    useEffect(() => {
        // 设置 1 秒后跳转到首页
        setTimeout(() => {
            Taro.navigateTo({ url: '/pages/index/index' });
        }, 1000);
    }, []);

    return (
        <View className='splash-screen'>
            <Image src={logo} className='logo' />
            <View className={"text"}>活  在  此  时  此  刻</View>
        </View>
    );
};

export default Splash;