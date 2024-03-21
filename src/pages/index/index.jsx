import React, {useEffect, useRef, useState} from 'react'
import {ScrollView, View} from '@tarojs/components'
import {Button, Cell, ConfigProvider, Image, Popup, Range, SearchBar, Tabs, Picker, Tag} from "@nutui/nutui-react-taro"
import './index.scss'
import {request} from "../../utils/api";
import drawIcon from '../../assets/draw.png';
import listenIcon from '../../assets/listen.png';
import rightIcon from '../../assets/right.png';
import starIcon from '../../assets/star.png';
import unstarIcon from '../../assets/unstar.png';
import startIcon from '../../assets/start.png';
import stopIcon from '../../assets/stop.png';
import timeIcon from '../../assets/time.png';
import breathIcon44 from '../../assets/44.png';
import breathIcon478 from '../../assets/478.png';
import helpIcon from '../../assets/help.png';
import voiceTimeCheckIcon from '../../assets/voicetimecheck.png';
import sleepSetIcon from '../../assets/set.png';
import closeIcon from '../../assets/close.png';

import VoiceItem from "../../components/voice";
import SleepItem from "../../components/sleep";
import voice from "../../components/voice";
import Taro, {useSaveExitState} from '@tarojs/taro';
import BreathBackgroundVoiceItem from "../../components/breath";

function Index() {
    // 音频组件相关start
    const [timer, setTimer] = useState(null);
    const innerAudioContextVoiceRef = Taro.getBackgroundAudioManager();


    // const innerAudioContextSleepRef = Taro.createInnerAudioContext();
    const sleepBackgroundAudioContextRef = useRef(Taro.createInnerAudioContext());

    const handleInnerAudioPlay = (value) => {

        console.log("handleInnerAudioPlay",value)
    }
    // 音频组件相关end

    // 是否展示搜索页
    const [searchMode,setSearchMode] = useState(0);

    // 从本地缓存读取start
    const [historyList,setHistoryList] = useState([]);
    const [voiceStarList,setVoiceStarList] = useState([]);
    const [sleepStarList,setSleepStarList] = useState([]);
    // 从本地缓存读取end


    const handleClickHistory = (item) =>{
        console.log("handleClickHistory",item)
        setSearchFilterData({
            'page':1,
            'voice_name':item
        })
    }

    const host = "http://now.local.com/";
    const [tabValue,setTabValue] = useState(0);
    const [voiceTabValue,setVoiceTabValue] = useState(0);
    const [indexPage,setIndexPage] = useState(1);
    const [voiceName,setVoiceName] = useState("");
    const [voiceTypeList,setVoiceTypeList] = useState([]);
    const [voiceList,setVoiceList] = useState([]);
    const [sleepList,setSleepList] = useState([]);
    const [activeTab,setActiveTab] = useState(0);
    const [countList,setCountList] = useState([]);
    const [searchVoiceList,setSearchVoiceList] = useState([]);

    const [sleepBackgroundList,setSleepBackgroundList] = useState([]);
    const [breathBackgroundList,setBreathBackgroundList] = useState([]);

    const [backImg,setBackImg] = useState("http://now.local.com/uploads/20240309/cdaab7bd3b54da36b944c218e761d0c4.jpg")

    const [backVoice,setBackVoice] = useState("http://now.local.com/uploads/20240309/c1461b2fd88d44a29922b9410eaf9747.mp3")
    const [backSleep,setBackSleep] = useState("http://now.local.com/uploads/20240309/c1461b2fd88d44a29922b9410eaf9747.mp3")

    const [backTitle,setBackTitle] = useState("");
    const [friendList,setFriendList] = useState([]);

    const [currentVoiceItem,setCurrentVoiceItem] = useState({
        'type':'voice',
        'id':0,
    })

    const [currentSleepItem,setCurrentSleepItem] = useState({
        'type':'sleep',
        'id':0,
    })


    //1声音模式 2睡眠模式 3呼吸模式
    const [appMode,setAppMode] = useState(1);

    //默认是一直循环的
    const [voiceTime,setVoiceTime] = useState(999)

    //呼吸的循环时间 默认十分钟
    const [breathTime,setBreathTime] =useState(10)

    //弹框默认是开启的
    const [showBottomRound,setShowBottomRound] = useState(true)

    //声音的设置popUp
    const [showVoiceSet,setShowVoiceSet] = useState(false)
    //助眠的设置popUp
    const [showSleepSet,setShowSleepSet] = useState(false)

    // 呼吸时间滑动选择的PopUp
    const [showBreathTimeSet,setShowBreathTimeSet] = useState(false)
    // 女声 男声 音效的设置
    const [showBreathVoiceSet,setShowBreathVoiceSet] = useState(false)

    //助眠背景音乐选择
    const [showSleepBackgroundVoice,setShowSleepBackgroundVoice] = useState(false)

    //呼吸背景音乐选择
    const [showBreathBackgroundVoice,setShowBreathBackgroundVoice] = useState(false)

    //助眠设置的背景音乐Item
    const [sleepBreathBackgroundItem,setSleepBreathBackgroundItem] = useState({
        'breath_background_name':'不使用',
        'breath_background_voice':'',
        'breath_background_id':0,
    })

    // 呼吸设置的背景音乐Item
    const [breathBackgroundItem,setBreathBackgroundItem] = useState({
        'breath_background_name':'不使用',
        'breath_background_voice':'',
        'breath_background_id':0,
    })

    //4-7-8呼吸+478|| 4x4箱式呼吸+44
    const [breathTypeItem,setBreathTypeItem] = useState({
        'type_name':'4-7-8呼吸',
        'type':478,
    })

    //男1 女2 音效3
    const [breathVoiceItem,setBreathVoiceItem] = useState({
        'voice_name':'女声',
        'voice':2,
    })

    const [filterData,setFilterData] =useState({
        'like':[],
        'type_id':1,
        'page':1,
        'voice_name':'',
    });

    // 专门用于搜索的筛选条件
    const [searchFilterData,setSearchFilterData] = useState({
        'page':1,
        'voice_name':'',
    })

    const [sleepFilterData,setSleepFilterData] = useState({
        'page': 1,
        'like':[],
    })

    // 助眠筛选背景音乐
    const [sleepBackgroundFilterData,setSleepBackgroundFilterData] = useState({
        'page': 1,
    })
    // 呼吸筛选背景音乐
    const [breathBackgroundFilterData,setBreathBackgroundFilterData] = useState({
        'page':1
    })

    const jumpContact = () => {
        Taro.navigateTo({ url: '/pages/contact/index'});
    }

    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    const handleScrollUpVoice = () => {
        console.log("scroll up");
    }

    const handleScrollUpSleep = () => {
        console.log("scroll up sleep");
    }

    const handleScrollUpSearchVoice = () => {
        console.log("scroll up searchVoice")
    }

    const handleScrollLowerVoice = () => {
        setFilterData((prevFilterData) =>({
            ...prevFilterData,
            'page':prevFilterData.page + 1,
        }));
    }

    const handleScrollLowerSearchVoice = () => {
        setSearchFilterData((prevSearchFilterData) => ({
            ...prevSearchFilterData,
            'page':prevSearchFilterData.page + 1,
        }));
    }


    const handleScrollLowerSleep = () => {
        setSleepFilterData((prevSleepFilterData) =>({
            ...prevSleepFilterData,
            'page':prevSleepFilterData.page + 1,
        }));
    }

    const handleVoiceItemClick = (item) => {
        console.log("voiceItem",item)
        setAppMode(1)
        setBackImg(host+item.background_img)
        setBackTitle(item.voice_name)
        setBackVoice(host+item.voice)
        setCurrentVoiceItem({
            ...currentVoiceItem,
            'id':item.id,
        })
    }

    const handleSleepItemClick = (item) => {
        console.log("sleepItem",item)
        setAppMode(2);
        setBackImg(host+item.sleep_background_img)
        setBackTitle(item.sleep_name)
        setBackSleep(host+item.sleep_voice)
        setCurrentSleepItem({
            ...currentSleepItem,
            'id':item.id,
        })
    }



    const handleSleepBackgroundItemClick = (item) => {
        console.log("sleepBackgroundItem",item)

        //如果重复点击就取消 如果不相同就渲染
        if(item.id === sleepBreathBackgroundItem.breath_background_id){
           setSleepBreathBackgroundItem({
               'breath_background_name':'不使用',
               'breath_background_voice':'',
               'breath_background_id':0,
           })
        }else{
            setSleepBreathBackgroundItem({
                'breath_background_name':item.breath_background_name,
                'breath_background_voice':item.breath_background_voice,
                'breath_background_id':item.id,
            })
        }
    }

    const handleBreathBackgroundItemClick = (item) => {
        console.log("breathBackgroundItem",item)

        //如果重复点击就取消 如果不相同就渲染
        if(item.id === breathBackgroundItem.breath_background_id){
            setBreathBackgroundItem({
                'breath_background_name':'不使用',
                'breath_background_voice':'',
                'breath_background_id':0,
            })
        }else{
            setBreathBackgroundItem({
                'breath_background_name':item.breath_background_name,
                'breath_background_voice':item.breath_background_voice,
                'breath_background_id':item.id,
            })
        }
    }

    const handleSleepVoiceVolume = (value) => {
        console.log("sleepVoiceVolume",value)
        // TODO
    }

    const handleSleepBackgroundVoiceVolume = (value) => {
        console.log("sleepBackgroundVoiceVolume",value)
        // TODO
    }

    const handleScrollUpSleepBackgroundVoice = () => {
        console.log(999)
    }

    const handleScrollUpBreathBackgroundVoice = () => {
        console.log(666)
    }

    const handleScrollLowerSleepBackgroundVoice = () => {
        setSleepBackgroundFilterData((prevSleepBackgroundFilterData) =>({
            ...prevSleepBackgroundFilterData,
            'page':prevSleepBackgroundFilterData.page + 1,
        }));
    }

    const handleScrollLowerBreathBackgroundVoice = () => {
        setBreathBackgroundFilterData((prevBreathBackgroundFilterData) =>({
            ...prevBreathBackgroundFilterData,
            'page':prevBreathBackgroundFilterData.page + 1,
        }));
    }

    const fetchFriendData = () => {
        return request("nowvoice/getFriendList")
    }

    const fetchIndexData = ()=>{
        console.log(9999999999);
      return request("nowvoice/index",filterData);
    }

    const fetchSearchVoiceData = ()=>{
        return request("nowvoice/index",searchFilterData)
    }

    const fetchVoiceType = () =>{
        return request("nowvoice/voiceTypeList",sleepFilterData);
    }

    const fetchCountList = () =>{
        return request("nowvoice/countList");
    }

    const fetchSleepData = () =>{
        return request("nowsleep/index",sleepFilterData);
    }

    const fetchSleepBackgroundData = () =>{
        return request("nowBreath/getBackgroundList",sleepBackgroundFilterData)
    }

    const fetchBreathBackgroundData = () =>{
        return request("nowBreath/getBackgroundList",breathBackgroundFilterData)
    }

    const handleVoiceSearch= (value) =>{
        addHistoryData(value)
        if(value.length < 1){
            Taro.showToast({
                title: '搜索不能为空',
                icon: 'none',
                duration: 2000
            });
        }
        setSearchFilterData({
            'page':1,
            'voice_name':value,
        });
    }

    const handleVoiceClear = ()=>{
        setSearchFilterData({
            'voice_name':"",
            'page':1,
        })
    }

    const handleShowSearchPage = ()=>{
        console.log("showSearchPage!!")
        setSearchMode(1);
    }

    const handleVoiceTimeSet = (value)=>{
        setVoiceTime(value)
    }

    const handleBreathVoiceSet = (value)=>{
        console.log("handleBreathVoice")
        if(value === 1 ){
            setBreathVoiceItem({
                'voice_name':'男声',
                'voice':1
            })
        }
        if(value === 2 ){
            setBreathVoiceItem({
                'voice_name':'女声',
                'voice':2
            })
        }
        if(value === 3 ){
            setBreathVoiceItem({
                'voice_name':'音效',
                'voice':3
            })
        }
    }


    // 呼吸时间选择start
    const [visible, setVisible] = useState(false)
    const [baseDesc, setBaseDesc] = useState('')
    const listData1 = [
        [
            { value: 5, text: '5',},
            { value: 10, text: '10',},
            { value: 15, text: '15',},
            { value: 40, text: '30',},
            { value: 45, text: '45',},
            { value: 60, text: '60',},
        ],
    ]
    const changePicker = (list, option, columnIndex) => {
        console.log(columnIndex, option)
    }
    const confirmPicker = (options, values) => {
        let description = ''
        options.forEach((option) => {
            description += option.text
        })
        setBaseDesc(description)
    }
    // 呼吸时间选择end

    const fetchHistoryData = () => {
        Taro.getStorage({
            key: 'history',
            success: function (res) {
                // 获取存储的数组
                const historyList = res.data || []; // 如果获取到的数据为空，则初始化一个空数组
                setHistoryList(historyList);
                console.log("fetchHistoryData init historyList",historyList)
            },
            fail: function(res){
                console.log("fetchHis Fail",res)
                initHistoryData()
            }
        });
    }

    const initHistoryData = () => {
        Taro.setStorage({
            key: 'history',
            data: [],
            success: function () {
                console.log('initHistoryData success')
            }
        });
    }

    const addHistoryData = (value) => {
        Taro.getStorage({
            key: 'history',
            success: function (res) {
                // 获取存储的数组
                const historyArray = res.data || []; // 如果获取到的数据为空，则初始化一个空数组


                if(!historyArray.includes(value)){
                    // 添加新数据到数组中
                    historyArray.push(value); // 这里假设要添加的数据为 'newItem'，你可以替换为你想要添加的实际数据

                    // 存储更新后的数组
                    Taro.setStorage({
                        key: 'history',
                        data: historyArray,
                        success: function () {
                            setHistoryList(historyArray)
                            console.log('addHistoryData success',historyArray)
                        }
                    });
                }else{
                    console.log("重复的历史记录不再添加")
                }
            }
        });
    }

    const delHistoryData = () => {
        console.log("重置本地的 historyData")
        Taro.setStorage({
            key: 'history',
            data: [],
            success: function () {
                setHistoryList([])
            }
        });
    }


    const initMyStarData = (keyName) => {
        Taro.setStorage({
            key: keyName,
            data: [],
            success: function () {
                console.log('init StarData success',keyName)
            }
        });
    }

    const fetchStarData = (keyName) => {
        Taro.getStorage({
            key: keyName,
            success: function (res) {
                // 获取存储的数组
                const List = res.data || []; // 如果获取到的数据为空，则初始化一个空数组

                if(keyName === "voice"){
                    setVoiceStarList(List)
                    console.log("fetchVoiceStarData",List)
                    setFilterData({
                        ...filterData,
                        'like':List,
                    })
                }

                if(keyName === "sleep"){
                    setSleepStarList(List)
                    console.log("fetchSleepStarData",List)
                    setSleepFilterData({
                        ...sleepFilterData,
                        'like':List,
                    })
                }
            },
            fail: function(res){
                console.log("fetchStarData Fail",res)
                //获取失败就对应做初始化
                initMyStarData(keyName)
            }
        });
    }

    //添加本地star数据  setVoice/SleepStarList
    const addStarData = (keyName,value) => {
        Taro.getStorage({
            key: keyName,
            success: function (res) {
                // 获取存储的数组
                const listArray = res.data || []; // 如果获取到的数据为空，则初始化一个空数组


                if(!listArray.includes(value)){
                    // 添加新数据到数组中
                    listArray.push(value); // 这里假设要添加的数据为 'newItem'，你可以替换为你想要添加的实际数据

                    // 存储更新后的数组
                    Taro.setStorage({
                        key: keyName,
                        data: listArray,
                        success: function () {
                            if(keyName === "voice"){
                                setVoiceStarList(listArray)
                                console.log('addVoiceStarData success',listArray)
                                setFilterData({
                                    ...filterData,
                                    'like':listArray,
                                })
                            }

                            if(keyName === "sleep"){
                                setSleepStarList(listArray)
                                console.log('addSleepStarData success',listArray)
                                setSleepFilterData({
                                    ...sleepFilterData,
                                    'like': listArray,
                                })
                            }
                        }
                    });
                }else{
                    console.log("重复的历史记录不再添加")
                }
            }
        });
    }

    //删除本地star数据 setVoice/SleepStarList
    const delStarData = (keyName,value) => {
        Taro.getStorage({
            key: keyName,
            success: function (res) {
                // 获取存储的数组
                const listArray = res.data || []; // 如果获取到的数据为空，则初始化一个空数组


                if(listArray.includes(value)){
                    // 如果数组包含值，则从数组中删除
                    const index = listArray.indexOf(value);
                    if (index > -1) {
                        listArray.splice(index, 1);

                        // 存储更新后的数组
                        Taro.setStorage({
                            key: keyName,
                            data: listArray,
                            success: function () {
                                if (keyName === "voice") {
                                    setVoiceStarList(listArray);
                                    console.log('removeVoiceStarData success', listArray);
                                }

                                if (keyName === "sleep") {
                                    setSleepStarList(listArray);
                                    console.log('removeSleepStarData success', listArray);
                                }
                            }
                        });
                    }
                }else{
                    console.log("不存在的star数据不作删除")
                }
            }
        });
    }


    useEffect(() => {
        fetchIndexData().then((data) => {
            setVoiceList(data.list)
        })
        fetchVoiceType().then((data) => {
            setVoiceTypeList(data.list)
        })
        fetchCountList().then((data) => {
            setCountList(data.list)
        })
        fetchSleepData().then((data) => {
            setSleepList(data.list)
        })
        fetchFriendData().then((data) => {
            setFriendList(data.list)
        })
        fetchSleepBackgroundData().then((data) => {
            setSleepBackgroundList(data.list)
        })
        fetchBreathBackgroundData().then((data) => {
            setBreathBackgroundList(data.list)
        })

        fetchHistoryData()
        fetchStarData("voice")
        fetchStarData("sleep")

        // 在组件卸载时释放音频实例 这个后续看看在哪里释放合理
        // TODO
        // return () => {
        //     innerAudioContextRef.current.destroy();
        //     sleepBackgroundAudioContextRef.current.destroy();
        // }
    }, []);

    useEffect(() => {
        // console.log('voiceTypeList',{voiceTypeList})
        // console.log('voiceList',{voiceList})
        // console.log('countList',{countList})
        // console.log('friendList',friendList);
        // console.log("sleepBackgroundList",sleepBackgroundList)
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
        console.log("voiceStarList",voiceStarList)
        console.log("sleepStarList",sleepStarList)
        console.log("voiceList",voiceList)
        console.log("sleepList",sleepList)
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    }, [voiceList,voiceTypeList,countList,friendList,sleepBackgroundList,voiceStarList,sleepStarList]);

    //页面上的筛选项变化后 请求借口去更新页面数据
    useEffect(() => {
        fetchIndexData().then((data)=>{
            console.log("voiceData on filterData Changed",data)
            // console.log('...voiceList',...voiceList)
            // console.log('...data.list',...data.list)
            // console.log('data.list.length',data.list.length)
            if(data.list.length > 0){
                if(filterData.page > 1){
                    setVoiceList([...voiceList,...data.list])
                }else{
                    setVoiceList(data.list)
                }
            }else{
                //如果有搜索 给渲染空
                if(filterData.voice_name){
                    setVoiceList(data.list)
                }
                //如果就在第一页 可能是切换tab 也要渲染空 不影响翻页渲染就行
                if(filterData.page === 1){
                    setVoiceList(data.list)
                }
                console.log("无数据了 不渲染");
            }

        })

        console.log('filterData用于正常翻页',filterData)
    }, [filterData]);

    //搜索页专用的渲染
    useEffect(() => {
        fetchSearchVoiceData().then((data) =>{
            if(data.list.length > 0){
                if(searchFilterData.page > 1){
                    setSearchVoiceList([...searchVoiceList,...data.list])
                }else{
                    setSearchVoiceList(data.list)
                }
            }else{
                if(searchFilterData.page === 1){
                    setSearchVoiceList(data.list)
                    console.log("搜索结果为空")
                }

            }
        })


        console.log('searchFilterData用于搜索页',searchFilterData)
    }, [searchFilterData]);



    useEffect(() => {
        fetchSleepData().then((data)=>{
            if(data.list.length > 0){
                if(sleepFilterData.page > 1){
                    setSleepList([...sleepList,...data.list])
                }else{
                    setSleepList(data.list)
                }
            }else{
                console.log("无数据，不渲染sleep")
            }
        })
    }, [sleepFilterData]);

    useEffect(() => {
        fetchSleepBackgroundData().then((data) =>{
            if(data.list.length > 0){
                if(sleepBackgroundFilterData.page > 1){
                    setSleepBackgroundList([...sleepBackgroundList,...data.list])
                }else{
                    setSleepBackgroundList(data.list)
                }
            }else{
                console.log("无数据，不渲染sleep")
            }
        })
    },[sleepBackgroundFilterData])

    //监听声音
    useEffect(() => {
        //不自动播放
        innerAudioContextVoiceRef.autoplay = false;
        innerAudioContextVoiceRef.loop = true;



        console.log(backVoice)

        if(backVoice.length > 0 && backVoice !== innerAudioContextVoiceRef.src) {
            innerAudioContextVoiceRef.src = backVoice;
        }

        // 清除旧的定时器
        clearTimeout(timer);

        console.log('voiceRef',innerAudioContextVoiceRef)
        innerAudioContextVoiceRef.play()


        if(innerAudioContextVoiceRef.src){
            const newTimer = setTimeout(() => {
                innerAudioContextVoiceRef.pause();
            }, voiceTime * 60 * 1000); // 分钟后执行暂停操作

            setTimer(newTimer)
            console.log("voiceTime",timer)

            // 返回清理函数，用于在组件卸载或 voiceTime 改变时清除定时器
            return () => {
                clearTimeout(timer);
            };
        }

    }, [backVoice,voiceTime]);

    //声音定时
    // useEffect(() => {
    //     // 清除旧的定时器
    //     clearTimeout(timer);
    //
    //     if(innerAudioContextVoiceRef.src){
    //         const newTimer = setTimeout(() => {
    //             innerAudioContextVoiceRef.pause();
    //         }, voiceTime * 60 * 1000); // 分钟后执行暂停操作
    //
    //         setTimer(newTimer)
    //         console.log("voiceTime",timer)
    //
    //         // 返回清理函数，用于在组件卸载或 voiceTime 改变时清除定时器
    //         return () => {
    //             clearTimeout(timer);
    //         };
    //     }
    // }, [voiceTime]);

    // useEffect(() => {
    //     innerAudioContextSleepRef.autoplay = false
    //     innerAudioContextSleepRef.loop = true
    //     if(backSleep.length > 0){
    //         innerAudioContextSleepRef.src = backSleep;
    //     }
    //
    // }, [backSleep]);

    //睡眠背景音乐选择的触发
    useEffect(() => {
        //背景音乐 自动播放
        sleepBackgroundAudioContextRef.autoplay = true;
        //背景默认无限循环
        sleepBackgroundAudioContextRef.loop = true;
        sleepBackgroundAudioContextRef.src=sleepBreathBackgroundItem.breath_background_voice
    }, [sleepBreathBackgroundItem]);

    //呼吸背景音选择的触发
    useEffect(() => {
        //背景音乐 自动播放
        sleepBackgroundAudioContextRef.autoplay = true;
        //背景默认无限循环
        sleepBackgroundAudioContextRef.loop = true;
        sleepBackgroundAudioContextRef.src=breathBackgroundItem.breath_background_voice
    }, [breathBackgroundItem]);


    return (
        <>
            <ConfigProvider
                theme={{
                    nutuiSearchbarBackground: '#FFFFFF',
                    nutuiSearchbarInputTextAlign: 'left',
                    nutuiSearchbarContentBackground: '#F5F5F5',
                    nutuiSearchbarPadding:'0rpx 0rpx',
                    nutuiSearchbarContentPadding:'0 28rpx',
                    nutuiSearchbarInputPadding:'0 28rpx',
                    nutuiSearchbarColor:'#BBBBBB',
                    nutuiSearchbarContentBorderRadius:'10rpx',
                    nutuiTabsTitlesPadding:'0 0 0 0',
                    nutuiTabsTitlesItemColor:'#666666',
                    nutuiRangeActiveColor:'#65C565',
                    nutuiPopupAnimationDuration:'1s',
                    nutuiTagPadding:'5px 13px',
                    nutuiTagFontSize:'15px',
                }}
            >
                <View className={"outer-box"}>
                    <img src={backImg} className={"background-image"}/>
                    {showBottomRound && (
                        <View className={"header-box"}>

                            <View className={"header-top"}>Hi，此时此刻</View>
                            <View className={'header-mid'}>有时候，什么也不做是非常重要的</View>
                            <View className={'header-bottom'}>- 此时此刻</View>
                        </View>
                    )}

                    {friendList.length > 0 && (
                        <View className={"content-box"}>
                            <View className={"content-text"}>
                                <View className={"text-up"}>{friendList[0].content}</View>
                                <View className={"text-down"}>-{friendList[0].author}</View>
                            </View>
                            <View className={"content-icon"} onClick={() => jumpContact()}>
                                <View className={"icon-up"}><img className={"content-icon-img"} src={helpIcon}/></View>
                                <View className={"icon-down"}>同行互助</View>
                            </View>
                        </View>
                    )}

                    {backTitle.length>0 && (
                        <View className={"background-title-box"}>
                            {backTitle}
                        </View>
                    )}

                    {/*声音模式展示这种交互*/}
                    {appMode ===1 && (
                        <View class={"voice-action-box"}>
                            {voiceStarList.includes(currentVoiceItem.id) ?(
                                <View className={"box-side-left"} onClick={() => (delStarData("voice",currentVoiceItem.id))}>
                                    <img className={"voice-side-img"} src={starIcon}/>
                                </View>
                            ):(
                                <View className={"box-side-left"} onClick={() => (addStarData("voice",currentVoiceItem.id))}>
                                    <img className={"voice-side-img"} src={unstarIcon}/>
                                </View>
                            )}

                            <View className={"box-center"}>
                                <img className={"voice-center-img"} src={startIcon}/>
                            </View>
                            <View className={"box-side-right"}  onClick={() => {
                                setShowVoiceSet(true)
                            }}>
                                <img className={"voice-side-img"} src={timeIcon}/>
                            </View>
                        </View>
                    )}

                    {appMode ===2 && (
                        <View class={"sleep-action-box"}>
                            {sleepStarList.includes(currentSleepItem.id)?(
                                <View className={"box-side-left"} onClick={() => (delStarData("sleep",currentSleepItem.id))}>
                                    <img className={"sleep-side-img"} src={starIcon}/>
                                </View>
                            ):(
                                <View className={"box-side-left"} onClick={() => (addStarData("sleep",currentSleepItem.id))}>
                                    <img className={"sleep-side-img"} src={unstarIcon}/>
                                </View>
                            )}

                            <View className={"box-center"}>
                                <img className={"sleep-center-img"} src={startIcon}/>
                            </View>
                            <View className={"box-side-right"}  onClick={() => {
                                setShowSleepSet(true)
                            }}>
                                <img className={"sleep-side-img"} src={sleepSetIcon}/>
                            </View>
                        </View>
                    )}


                    <View class={"outer-footer-call"} onClick={() => {
                        setShowBottomRound(true)
                    }}>
                        <img src={drawIcon} className={"call-draw-img"}/>
                    </View>

                    <Popup duration={1000} title={<View style={{color:'#666666'}}>定时停止</View>} visible={showVoiceSet} style={{height: '65%', border: "0px solid black"}}
                           lockScroll={false}
                           overlayStyle={{'background':'unset'}}
                           position={"bottom"} round onClose={() => {
                        setShowVoiceSet(false)
                    }}>
                        <View className={"voice-set-box"}>
                            <View className={"voice-time-item"} onClick={()=>handleVoiceTimeSet(5)}>
                                <View className={"item-left"}>5分钟</View>
                                {voiceTime === 5 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"voice-time-item"} onClick={()=>handleVoiceTimeSet(10)}>
                                <View className={"item-left"}>10分钟</View>
                                {voiceTime === 10 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"voice-time-item"} onClick={()=>handleVoiceTimeSet(15)}>
                                <View className={"item-left"}>15分钟</View>
                                {voiceTime === 15 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"voice-time-item"} onClick={()=>handleVoiceTimeSet(30)}>
                                <View className={"item-left"}>30分钟</View>
                                {voiceTime === 30 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"voice-time-item"} onClick={()=>handleVoiceTimeSet(45)}>
                                <View className={"item-left"}>45分钟</View>
                                {voiceTime === 45 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"voice-time-item"} onClick={()=>handleVoiceTimeSet(60)}>
                                <View className={"item-left"}>60分钟</View>
                                {voiceTime === 60 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"voice-time-item"} onClick={()=>handleVoiceTimeSet(999)}>
                                <View className={"item-left"}>不停止</View>
                                {voiceTime === 999 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                        </View>
                    </Popup>


                    <Popup duration={1000} title={<View style={{color:'#666666'}}>播放设置</View>} visible={showSleepSet} style={{height: '35%', border: "0px solid black"}}
                           lockScroll={false}
                           overlayStyle={{'background':'unset'}}
                           position={"bottom"} round onClose={() => {
                        setShowSleepSet(false)
                    }}>
                        <View className={"sleep-set-box"}>
                            <View className={"box-item"}>
                                <View className={"item-left"}>人声</View>
                            </View>
                            <View className={"box-item"}>
                                <Range
                                    defaultValue={30}
                                    maxDescription={null}
                                    minDescription={null}
                                    onEnd={(val) => handleSleepVoiceVolume(val)}
                                />
                            </View>
                            <View className={"box-item"}>
                                <View className={"item-left"}>
                                    背景声音
                                </View>
                            </View>
                            <View className={"box-item"}>
                                <Range
                                    defaultValue={0}
                                    maxDescription={null}
                                    minDescription={null}
                                    onEnd={(val) => handleSleepBackgroundVoiceVolume(val)}
                                />
                            </View>
                            <View className={"box-item"} onClick={() => setShowSleepBackgroundVoice(true)}>
                                <View className={"item-left"}>背景音乐</View>
                                <View className={"item-right"} >
                                    <View className={"right-left"}>{sleepBreathBackgroundItem.breath_background_name}</View>
                                    <img src={rightIcon} className={"right-right"}/>
                                </View>
                            </View>
                        </View>
                    </Popup>

                    <Popup duration={1000} closeable overlay={false}  title={<View style={{color:'#666666'}}>背景音乐</View>} visible={showSleepBackgroundVoice} style={{height: '85%', border: "0px solid black"}}
                           lockScroll={false}
                           overlayStyle={{'background':'unset'}}
                           position={"bottom"} round onClose={() => {
                        setShowSleepBackgroundVoice(false)
                    }}>
                        <View className={"sleep-background-outer-box"}>
                            <View className={"sleep-background-notice-box"}>提示：点击播放声音，再次点击停止播放</View>
                        <ScrollView
                            className={"sleep-background-scroll"}
                            scrollY
                            scrollWithAnimation
                            scrollTop={0}
                            // style={{ height: '100%' }}
                            lowerThreshold={20}
                            upperThreshold={20}
                            onScrollToUpper={handleScrollUpSleepBackgroundVoice}
                            onScrollToLower={handleScrollLowerSleepBackgroundVoice}
                        >
                            <View className={"sleep-background-voice-single"}>
                                {sleepBackgroundList.length >0 && sleepBackgroundList.map((item) => {
                                    return (
                                        <BreathBackgroundVoiceItem
                                            onClick={() => handleSleepBackgroundItemClick(item)}
                                            title={item.breath_background_name}
                                            img={item.breath_background_img}
                                            listen={sleepBreathBackgroundItem.breath_background_id === item.id?1:0}
                                        />
                                    )
                                })
                                }
                                {sleepBackgroundList.length === 0 && (<View className={"empty-notice"}>抱歉，没有找到符合条件结果</View>)}
                            </View>
                        </ScrollView>
                        </View>
                    </Popup>


                    {/*呼吸背景音乐*/}
                    <Popup duration={1000} zIndex={2001} closeable overlay={false}  title={<View style={{color:'#666666'}}>背景音乐2</View>} visible={showBreathBackgroundVoice} style={{height: '88%', border: "0px solid black"}}
                           lockScroll={false}
                           overlayStyle={{'background':'unset'}}
                           position={"bottom"} round onClose={() => {
                        setShowBreathBackgroundVoice(false)
                    }}>
                        <View className={"sleep-background-outer-box"}>
                            <View className={"sleep-background-notice-box"}>提示：点击播放声音，再次点击停止播放</View>
                            <ScrollView
                                className={"sleep-background-scroll"}
                                scrollY
                                scrollWithAnimation
                                scrollTop={0}
                                // style={{ height: '100%' }}
                                lowerThreshold={20}
                                upperThreshold={20}
                                onScrollToUpper={handleScrollUpSleepBackgroundVoice}
                                onScrollToLower={handleScrollLowerSleepBackgroundVoice}
                            >
                                <View className={"sleep-background-voice-single"}>
                                    {breathBackgroundList.length >0 && breathBackgroundList.map((item) => {
                                        return (
                                            <BreathBackgroundVoiceItem
                                                onClick={() => handleBreathBackgroundItemClick(item)}
                                                title={item.breath_background_name}
                                                img={item.breath_background_img}
                                                listen={breathBackgroundItem.breath_background_id === item.id?1:0}
                                            />
                                        )
                                    })
                                    }
                                    {breathBackgroundList.length === 0 && (<View className={"empty-notice"}>抱歉，没有找到符合条件结果</View>)}
                                </View>
                            </ScrollView>
                        </View>
                    </Popup>

                    {/*//呼吸模式PopUp*/}
                    <Popup duration={1000} zIndex={2001} title={<View style={{color:'#666666'}}>呼吸时长</View>} visible={showBreathTimeSet} style={{height: '52%', border: "0px solid black"}}
                           lockScroll={false}
                           position={"bottom"} round onClose={() => {
                        setShowBreathTimeSet(false)
                    }}>
                        <View className={"breath-time-set-box"}>
                            <View className={"breath-time-item"} onClick={()=>setBreathTime(5)}>
                                <View className={"item-left"}>5分钟</View>
                                {breathTime === 5 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-time-item"} onClick={()=>setBreathTime(10)}>
                                <View className={"item-left"}>10分钟</View>
                                {breathTime === 10 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-time-item"} onClick={()=>setBreathTime(15)}>
                                <View className={"item-left"}>15分钟</View>
                                {breathTime === 15 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-time-item"} onClick={()=>setBreathTime(30)}>
                                <View className={"item-left"}>30分钟</View>
                                {breathTime === 30 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-time-item"} onClick={()=>setBreathTime(45)}>
                                <View className={"item-left"}>45分钟</View>
                                {breathTime === 45 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-time-item"} onClick={()=>setBreathTime(60)}>
                                <View className={"item-left"}>60分钟</View>
                                {breathTime === 60 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                        </View>
                    </Popup>

                    {/*//呼吸引导PopUp*/}
                    <Popup duration={1000} zIndex={2001} title={<View style={{color:'#666666'}}>呼吸引导</View>} visible={showBreathVoiceSet} style={{height: '20%', border: "0px solid black"}}
                           lockScroll={false}
                           position={"bottom"} round onClose={() => {
                        setShowBreathVoiceSet(false)
                    }}>
                        <View className={"breath-voice-set-box"}>
                            <View className={"breath-voice-item"} onClick={()=>handleBreathVoiceSet(1)}>
                                <View className={"item-left"}>男声</View>
                                {breathVoiceItem.voice === 1 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-voice-item"} onClick={()=>handleBreathVoiceSet(2)}>
                                <View className={"item-left"}>女声</View>
                                {breathVoiceItem.voice === 2 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-voice-item"} onClick={()=>handleBreathVoiceSet(3)}>
                                <View className={"item-left"}>音效</View>
                                {breathVoiceItem.voice === 3 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                        </View>
                    </Popup>

                    {/*//主页面Popup*/}
                    <Popup duration={1000} overlay={true} visible={showBottomRound} style={{height: '88%', border: "0px solid black"}}
                           lockScroll={false}
                           overlayStyle={{'background':'unset'}}
                           position={"bottom"} round onClose={() => {setShowBottomRound(false)}}>
                        <View className={"index-popup-inner-box"}>
                            <View className={"pull-icon"} onClick={() => {
                                setShowBottomRound(false)
                            }}>
                                <Image width={"40rpx"} height={"30rpx"} src={drawIcon}/>
                            </View>

                            <View className={"search-box"}>
                                {searchMode ===1 ? (
                                    <SearchBar placeholder="搜索声音"
                                               onSearch={(value) => handleVoiceSearch(value)}
                                               onClear={() => handleVoiceClear()}
                                               onFocus={() => handleShowSearchPage()}
                                               value={searchFilterData.voice_name}
                                               right={<View onClick={()=>{setSearchMode(0)}}>取消</View>}
                                    />
                                ):(
                                    <SearchBar placeholder="搜索声音"
                                    onSearch={(value) => handleVoiceSearch(value)}
                                    onClear={() => handleVoiceClear()}
                                    onFocus={() => handleShowSearchPage()}
                                    value={searchFilterData.voice_name}
                                    />
                                )}


                            </View>


                            {searchMode === 0 && (
                                <View className={"under-search-box"}>
                            <View className={"tabs-box"}>
                                <View className={`tabs-item ${activeTab === 0 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(0)}>声音</View>
                                <View className={`tabs-item ${activeTab === 1 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(1)}>助眠</View>
                                <View className={`tabs-item ${activeTab === 2 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(2)}>呼吸</View>
                            </View>

                            {activeTab === 0 && (<View className={"tabs-item-bottom"}>
                                <Tabs value={tabValue}
                                      align={"left"}
                                      tabStyle={{width: '664rpx', background: '#FFFFFF'}}
                                      activeType="button"
                                      activeColor={"#FFFFFF"}
                                      onChange={(value) => {
                                          console.log("Tabs Onchange value", value)
                                          setTabValue(value)
                                          setFilterData((prevFilterData) => ({
                                              ...prevFilterData,
                                              'type_id': voiceTypeList[value].type_id,
                                              'page': 1,
                                          }));
                                      }
                                      }>
                                    {voiceTypeList.map((item) => {
                                        return (
                                            <Tabs.TabPane title={item.type_name}>
                                            </Tabs.TabPane>
                                        )
                                    })}
                                </Tabs>
                                <ScrollView
                                    className={"voice-scroll"}
                                    scrollY
                                    scrollWithAnimation
                                    scrollTop={0}
                                    // style={{ height: '100%' }}
                                    lowerThreshold={20}
                                    upperThreshold={20}
                                    onScrollToUpper={handleScrollUpVoice}
                                    onScrollToLower={handleScrollLowerVoice}
                                >
                                    <View className={"bottom-single-page-voice"}>
                                        {voiceList.length >0 && voiceList.map((item) => {
                                            return (
                                                <VoiceItem
                                                    onClick={() => handleVoiceItemClick(item)}
                                                    title={item.voice_name}
                                                    img={item.background_img}
                                                    like={item.voice_listen_num}
                                                    star={voiceStarList.includes(item.id) ? 1: 0}
                                                />
                                            )
                                        })
                                        }
                                        {voiceList.length === 0 && (<View className={"empty-notice"}>抱歉，没有找到符合条件结果</View>)}
                                    </View>
                                </ScrollView>

                            </View>)}
                            {activeTab === 1 && (<View className={"tabs-item-bottom"}>
                                <ScrollView
                                    className={"sleep-scroll"}
                                    scrollY
                                    scrollWithAnimation
                                    scrollTop={0}
                                    // style={{ height: '100%' }}
                                    lowerThreshold={20}
                                    upperThreshold={20}
                                    onScrollToUpper={handleScrollUpSleep}
                                    onScrollToLower={handleScrollLowerSleep}
                                >
                                    <View className={"bottom-single-page-sleep"}>
                                        {
                                            sleepList.map((item) => {
                                                return (
                                                    <SleepItem
                                                        onClick={() => handleSleepItemClick(item)}
                                                        title={item.sleep_name}
                                                        img={item.sleep_background_img}
                                                        like={item.sleep_listen_num}
                                                        star={sleepStarList.includes(item.id) ? 1: 0}
                                                    />
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>

                            </View>)}
                            {activeTab === 2 && (<View className={"tabs-item-bottom"}>
                                <View className={"bottom-single-page"}>
                                    <View className={"select-breath-duration"}>
                                        <View className={"breath-type-item-box"+(breathTypeItem.type === 478 ? "-selected":"")} onClick={() => setBreathTypeItem({
                                            'type_name':'4-7-8呼吸',
                                            'type':478,
                                        })}>
                                            <img className={"breath-type-top"} src={breathIcon478}/>
                                            <View className={"breath-type-mid"}>4-7-8呼吸</View>
                                            <View className={"breath-type-bottom"}>神经系统的天然镇静剂</View>
                                        </View>
                                        <View className={"breath-type-item-box"+(breathTypeItem.type === 44 ? "-selected":"")} onClick={() => setBreathTypeItem({
                                            'type_name':'4x4箱式呼吸',
                                            'type':44,
                                        })}>
                                            <img className={"breath-type-top"} src={breathIcon44}/>
                                            <View className={"breath-type-mid"}>4x4箱式呼吸</View>
                                            <View className={"breath-type-bottom"}>一种深度放松技术</View>
                                        </View>
                                    </View>
                                    <View className={"mid-breath-action-box"}>
                                        <View className={"action-item"} onClick={() => setShowBreathTimeSet(true)}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>{breathTime + " 分钟"}</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down"}>呼吸时长</View>
                                        </View>
                                        <View className={"action-item"} onClick={() => setShowBreathVoiceSet(true)}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>{breathVoiceItem.voice_name}</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down"}>呼吸引导</View>
                                        </View>
                                        <View className={"action-item"} onClick={() =>setShowBreathBackgroundVoice(true)}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>{breathBackgroundItem.breath_background_name}</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down"}>背景音乐</View>
                                        </View>
                                    </View>
                                    <View className={"breath-bottom-box"}>
                                        <Button type="primary" fill="outline" color="#65C565" size="large">
                                            开始
                                        </Button>
                                    </View>
                                </View>
                            </View>)}
                        </View>

                            )}

                            {searchMode === 1 && searchFilterData.voice_name === "" ?
                                (<View className={"under-search-box"}>
                                    <View className={"search-history-box"}>
                                        <View className={"history-top-box"}>
                                            <View className={"history-title"}>搜索历史</View>
                                            <View className={"history-clear"}>
                                                <img src={closeIcon} onClick={() => delHistoryData()} className={"history-clear-img"}/>
                                            </View>
                                        </View>
                                        <View className={"history-list"}>
                                            {
                                                historyList.map((item) =>{
                                                    return (
                                                        <Tag background="#F5F5F5" color="#333333" onClick={() => handleClickHistory(item)}>{item}</Tag>
                                                    )
                                                } )
                                            }
                                        </View>
                                    </View>
                                </View>
                            ):(
                                searchMode ===1 &&(
                                <View className={"under-search-box"}>
                                    {searchVoiceList.length > 0 ?(
                                        <ScrollView
                                            className={"search-voice-scroll"}
                                            scrollY
                                            scrollWithAnimation
                                            scrollTop={0}
                                            // style={{ height: '100%' }}
                                            lowerThreshold={20}
                                            upperThreshold={20}
                                            onScrollToUpper={handleScrollUpSearchVoice}
                                            onScrollToLower={handleScrollLowerSearchVoice}
                                        >
                                            <View className={"search-bottom-single-page-voice"}>
                                                {
                                                    searchVoiceList.map((item) => {
                                                        return (
                                                            <VoiceItem
                                                                onClick={() => handleVoiceItemClick(item)}
                                                                title={item.voice_name}
                                                                img={item.background_img}
                                                                like={item.voice_listen_num}
                                                            />
                                                        )
                                                    })
                                                }
                                            </View>
                                        </ScrollView>
                                    ):(
                                        <View className={"empty-notice-search"}>抱歉，没有找到符合条件的结果</View>
                                    )}
                                </View>
                                )
                            )}





                        </View>
                    </Popup>
                </View>
            </ConfigProvider>
        </>

  )
}

export default Index
