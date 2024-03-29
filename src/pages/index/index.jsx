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
import drawPopIcon from '../../assets/draw-pop.png';

import VoiceItem from "../../components/voice";
import SleepItem from "../../components/sleep";
import voice from "../../components/voice";
import Taro, {useSaveExitState} from '@tarojs/taro';
import BreathBackgroundVoiceItem from "../../components/breath";

function Index() {
    const [touchStart, setTouchStart] = useState(false);
    const [touchMove, setTouchMove] = useState(false);
    const [touchEnd, setTouchEnd] = useState(false);

    const [pureStatus,setPureStatus] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(true);
        console.log('触摸开始');
    };

    const handleTouchMove = (e) => {
        setTouchMove(true);
        setShowBottomRound(false)
        console.log('正在滑动');
    };

    const handleTouchEnd = (e) => {
        setTouchEnd(true);
        setShowBottomRound(false)
        console.log('触摸结束');
    };
    // 音频组件相关start
    const [timer, setTimer] = useState(null);

    const [timer44,setTimer44] = useState({
        '444':null,
    });

    const [timer478,setTimer478] = useState({
        '4784':null,
        '4787':null,
    });

    const [breathTimer,setBreathTimer] = useState(null);

    //全局唯一
    const backgroundAudioManager = Taro.getBackgroundAudioManager();

    backgroundAudioManager.onStop(() => {
        console.log("onStop 触发");
    });

    const [isAnimating478,setIsAnimating478] = useState(true)
    const [isAnimating44,setIsAnimating44] = useState(true)

    backgroundAudioManager.onEnded(() => {
        console.log("onEnded 触发")
        console.log("onEnded backAudioManager",backgroundAudioManager)
        console.log("onEnded backAudioManager/src",backgroundAudioManager.src)
        console.log("onEnded backAudioManager/title",backgroundAudioManager.title)
        console.log("backTitle",backTitle);
        //一定要赋予标题 否则会失效
        backgroundAudioManager.title=backTitle;
        console.log("onEnded backAudioManager/title",backgroundAudioManager.title)
        //用于循环的pause+play
        backgroundAudioManager.pause();
        backgroundAudioManager.play();


        if(currentBreathItem.current_breath_type === 478){
            //先暂停 再开启
            setIsAnimating478(false);
            setIsAnimating478(true);
        }

        if(currentBreathItem.current_breath_type === 44){
            //先暂停 再开启
            setIsAnimating44(false);
            setIsAnimating44(true);
        }


        //每次循环调用文字渲染 效果好 呼吸的蒙层和声音 助眠也不冲突
        handleDynamicTextChange(currentBreathItem.current_breath_type)

    });

    backgroundAudioManager.onPlay(() => {
        console.log("每次播放的事件监听")
    });

    backgroundAudioManager.onPause(() => {
        console.log("每次播放结束的事件监听")
        setVoiceBackPlay({
            ...voiceBackPlay,
            'status':0,
        })
        setSleepBackPlay({
            ...sleepBackPlay,
            'status':0,
        });
    });

    //播放暂停按钮控制
    const [voiceBackPlay,setVoiceBackPlay] = useState({
       'status':0,
    });

    //播放暂停按钮控制
    const [sleepBackPlay,setSleepBackPlay] = useState({
        'status':0,
    })

    //呼吸开始结束按钮控制
    const [breathBackPlay,setBreathBackPlay] = useState({
        'status':0,
    })

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
            ...searchFilterData,
            'page':1,
            'voice_name':item
        })
    }

    const host = "https://www.csck.tech/";
    const [tabValue,setTabValue] = useState(0);
    const [voiceTabValue,setVoiceTabValue] = useState(0);
    const [indexPage,setIndexPage] = useState(1);
    const [voiceName,setVoiceName] = useState("");
    const [voiceTypeList,setVoiceTypeList] = useState([]);
    const [voiceList,setVoiceList] = useState([]);
    const [sleepList,setSleepList] = useState([]);
    const [activeTab,setActiveTab] = useState(0);
    const [countList,setCountList] = useState([]);
    const [breathList,setBreathList] = useState([]);
    const [searchVoiceList,setSearchVoiceList] = useState([]);

    const [sleepBackgroundList,setSleepBackgroundList] = useState([]);
    const [breathBackgroundList,setBreathBackgroundList] = useState([]);

    const [backImg,setBackImg] = useState("")

    const [backVoice,setBackVoice] = useState("")
    const [backSleep,setBackSleep] = useState("")

    const [backTitle,setBackTitle] = useState("");
    const [friendList,setFriendList] = useState([]);

    // 用于star标记
    const [currentVoiceItem,setCurrentVoiceItem] = useState({
        'type':'voice',
        'id':0,
    })

    // 用于star标记
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

    const [breathDynamicText,setBreathDynamicText] = useState("吸气")

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
    // 呼吸开始后的动效页面
    const [showBreathDynamicSet,setShowBreathDynamicSet] = useState(false)
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

    const [currentBreathItem,setCurrentBreathItem] = useState({
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
        'type':'search',
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
        setPureStatus(1);
        setAppMode(1)
        setBackImg(host+item.background_img)
        setBackTitle(item.voice_name)
        setBackVoice(host+item.voice)
        setCurrentVoiceItem({
            ...currentVoiceItem,
            'id':item.id,
        })
        addListen(item.id)


    }

    const handleSleepItemClick = (item) => {
        console.log("sleepItem",item)
        setPureStatus(1);
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

    const handleBreathStart = () => {
        //breathTypeItem breathTime breathVoiceItem
        console.log("点击 呼吸开始按钮 开始渲染")

        console.log("breathTypeItem",breathTypeItem)
        console.log("breathTime",breathTime)
        console.log("breathVoiceItem",breathVoiceItem)
        console.log("breathList",breathList)
        if(breathVoiceItem.voice === 1){
            setCurrentBreathItem({
                ...currentBreathItem,
                'current_voice': breathList[breathTypeItem.type].male_voice,
                'current_breath_type':breathTypeItem.type,
                'current_voice_type':breathVoiceItem.voice,
                'current_time':breathTime,
            })
        }
        if(breathVoiceItem.voice === 2){
            setCurrentBreathItem({
                ...currentBreathItem,
                'current_voice': breathList[breathTypeItem.type].female_voice,
                'current_breath_type':breathTypeItem.type,
                'current_voice_type':breathVoiceItem.voice,
                'current_time':breathTime,
            })
        }
        if(breathVoiceItem.voice === 3){
            setCurrentBreathItem({
                ...currentBreathItem,
                'current_voice': breathList[breathTypeItem.type].other_voice,
                'current_breath_type':breathTypeItem.type,
                'current_voice_type':breathVoiceItem.voice,
                'current_time':breathTime,
            })
        }

        const newBreathTimer = setTimeout(() => {
            console.log("呼吸定时器触发成功",breathTime)
            setBreathBackPlay({
                ...breathBackPlay,
                'status':0,
            })
            backgroundAudioManager.pause();
        },breathTime * 1000 * 60)
        //专门的呼吸用的定时器
        setBreathTimer(newBreathTimer)

        //让呼吸蒙层可见
        setShowBreathDynamicSet(true);

        //打开呼吸播放按钮 前端不存在
        setBreathBackPlay({
            ...breathBackPlay,
            'status':1,
        })

        handleDynamicTextChange(breathTypeItem.type);
    }

    const handleDynamicTextChange = (type) => {


        if(type == 478){
            //每次调用 强制清除一下定时器 但基本也结束了
            clearTimeout(timer478["4784"])
            clearTimeout(timer478['4787'])

            console.log("handleDynamic478")
            setBreathDynamicText("吸气")

            const newTimer4784 = setTimeout(() => {
                setBreathDynamicText("屏气")
            },4000)

            const newTimer4787 = setTimeout(() => {
                setBreathDynamicText("呼气")
            },7000+4000)

            setTimer478({
                '4784':newTimer4784,
                '4787':newTimer4787,
            })
        }

        if(type == 44){
            //每次调用 强制清除一下定时器 但基本也结束了
            clearTimeout(timer44["444"])

            console.log("handleDynamic44")
            setBreathDynamicText("吸气")

            const newTimer444 = setTimeout(() => {
                setBreathDynamicText("呼气")
            },4000)

            setTimer44({
                '444':newTimer444,
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

    const fetchBreathList = () => {
        return request("nowBreath/indexnew");
    }

    const addListen = (id) => {
        return request("nowvoice/addListen",{'id':id});
    }

    const handleVoiceSearch= (value) =>{
        if(value.length < 1){
            Taro.showToast({
                title: '搜索不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if (value.indexOf(' ') !== -1) {
            Taro.showToast({
                title: '搜索不能包含空格',
                icon: 'none',
                duration: 2000
            });
        }else{
            setSearchFilterData({
                ...searchFilterData,
                'page':1,
                'voice_name':value,
            });
            addHistoryData(value)
        }

    }

    const handleVoiceClear = ()=>{
        setSearchFilterData({
            ...searchFilterData,
            'voice_name':"",
            'page':1,
        })
    }

    const handleSearchCancel = ()=> {
        setSearchMode(0)
        setSearchFilterData({
            ...searchFilterData,
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
        // 暂时测试 只设置1分钟定时
        // console.log("只设置30s定时")
        // setVoiceTime(0.5)
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
    // 呼吸时间选择end

    const fetchHistoryData = () => {
        Taro.getStorage({
            key: 'history',
            success: function (res) {
                // 获取存储的数组
                const historyList = res.data || []; // 如果获取到的数据为空，则初始化一个空数组
                setHistoryList(historyList);
                // console.log("fetchHistoryData init historyList",historyList)
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
                    // console.log("fetchVoiceStarData",List)
                    setFilterData({
                        ...filterData,
                        'like':List,
                    });
                }

                if(keyName === "sleep"){
                    setSleepStarList(List)
                    // console.log("fetchSleepStarData",List)
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
                                    setFilterData({
                                        ...filterData,
                                        'like':listArray,
                                    })
                                }

                                if (keyName === "sleep") {
                                    setSleepStarList(listArray);
                                    console.log('removeSleepStarData success', listArray);
                                    setSleepFilterData({
                                        ...sleepFilterData,
                                        'like': listArray,
                                    })
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

    //呼吸动态交互 点 结束
    const handleBreathClose = () => {
        //让蒙层不可见
        setShowBreathDynamicSet(false);

        //让呼吸声音停止
        setBreathBackPlay({
            ...breathBackPlay,
            'status':0,
        })

        //清理定时器
        clearTimeout(timer478["4784"])
        clearTimeout(timer478["4787"])
        clearTimeout(timer44["444"])
        clearTimeout(breathTimer)
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
        fetchBreathList().then((data) => {
            setBreathList(data.list)
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
        // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
        // console.log("voiceStarList",voiceStarList)
        // console.log("sleepStarList",sleepStarList)
        // console.log("voiceList",voiceList)
        // console.log("sleepList",sleepList)
        // console.log("currentBreathItem",currentBreathItem)
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

        console.log("searchVoiceList",searchVoiceList);
        console.log("searchFIlterData",searchFilterData);
    }, [voiceList,voiceTypeList,countList,friendList,sleepBackgroundList,voiceStarList,sleepStarList,currentBreathItem,searchVoiceList,searchFilterData]);

    //页面上的筛选项变化后 请求借口去更新页面数据
    useEffect(() => {
        fetchIndexData().then((data)=>{
            // console.log("voiceData on filterData Changed",data)
            // console.log("voiceData activateTab",tabValue)

            // console.log("filterData on changed",filterData)
            // console.log('...voiceList',...voiceList)
            // console.log('...data.list',...data.list)
            // console.log('data.list.length',data.list.length)

            // console.log('voiceFilter',filterData)
            // console.log('voiceStarList',voiceStarList)

            //特殊情况 用来初始化
            if(data.count > 10){
                setBackImg(host+data.list[0].background_img)
                //这边直接不渲染了 setBackVoice(host+data.list[0].voice)
                setBackTitle(data.list[0].voice_name)
            }

            if(data.count <= 10 && data.count > 0 && filterData.page === 1 && tabValue === 0 && pureStatus === 0){
                setBackImg(host+data.list[0].background_img)
                //这边直接不渲染了 setBackVoice(host+data.list[0].voice)
                setBackTitle(data.list[0].voice_name)
            }

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
        if(searchFilterData.voice_name === ""){
            console.log("搜索如果搜索值为空 不渲染")
        }else{
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
                    }
                    console.log("搜索结果为空")

                }
            })
        }
        console.log('searchFilterData用于搜索页',searchFilterData)
    }, [searchFilterData]);



    useEffect(() => {
        // console.log('sleepFilter',sleepFilterData)
        // console.log('sleepStarList',sleepStarList)

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

    //声音在设置的定时内 循环 定时达到暂停
    useEffect(() => {
        if(backTitle === "呼吸"){
           console.log("呼吸模式 不触发backTitle的 useEffect监控")
        }else{
            console.log("backgroundAudioManager",backgroundAudioManager)
            console.log("backgroundAudioManager/src",backgroundAudioManager.src)

            //专辑名
            backgroundAudioManager.epname ="此时此刻";

            //backVoice 只有初始化 和 点击的时候变化
            if(backVoice !== "" && backVoice !== undefined){
                //初始化的时候 我已经把默认的音频 setBackVoice给关掉了 现在只有点击item  handleVoiceItemClick中 触发setBackVoice
                console.log("只有在点击声音的时候 会触发这条！")

                //把按钮改成播放状态
                setVoiceBackPlay({
                    ...voiceBackPlay,
                    'status':1,
                })
                //点击就会清除定时
                clearTimeout(timer)
                backgroundAudioManager.title = backTitle;
                backgroundAudioManager.src = backVoice;
                backgroundAudioManager.webUrl = backVoice;
                //backVoice 变化监听的pause + play
                backgroundAudioManager.pause();
                backgroundAudioManager.play();
            }
        }




    },[backVoice]);

    useEffect(() => {
        //音乐名必填
        backgroundAudioManager.title = backTitle;
    }, [backTitle]);

    useEffect(() => {
        console.log("监控到 backSleep的变化 对应的useEffect")
        console.log("backgroundAudioManager",backgroundAudioManager)
        console.log("backgroundAudioManager/src",backgroundAudioManager.src)

        //专辑名
        backgroundAudioManager.epname ="此时此刻";


        //backVoice 只有初始化 和 点击的时候变化
        if(backSleep !== "" && backSleep !== undefined){
            //初始化的时候 我已经把默认的音频 setBackVoice给关掉了 现在只有点击item  handleVoiceItemClick中 触发setBackVoice
            console.log("只有在点击助眠的时候 会触发这条！")
            setSleepBackPlay({
                ...sleepBackPlay,
                'status':1,
            })

            backgroundAudioManager.title = backTitle;
            backgroundAudioManager.src = backSleep;
            backgroundAudioManager.webUrl = backVoice;
            //backSleep 变化监听的pause + play
            backgroundAudioManager.pause();
            backgroundAudioManager.play();
        }
    },[backSleep,currentSleepItem]);

    useEffect(() => {
        console.log("currentBreathItem 初始化的时候就被触发了！",currentBreathItem)

        if(currentBreathItem.current_breath_type !== undefined){
            //音乐名必填
            backgroundAudioManager.title = "呼吸";
            //专辑名
            backgroundAudioManager.epname ="此时此刻";
            backgroundAudioManager.src = host + currentBreathItem.current_voice;
            backgroundAudioManager.webUrl = backVoice;
            backgroundAudioManager.pause();
            backgroundAudioManager.play();
        }
    }, [currentBreathItem]);

    useEffect(() => {
        console.log("创建定时器 useEffect 启动")
        const newTimer = setTimeout(() => {
            console.log("定时器触发成功",voiceTime)
            setVoiceBackPlay({
                ...voiceBackPlay,
                'status':0,
            })
            backgroundAudioManager.pause();
        },voiceTime * 1000 * 60)

        setTimer(newTimer)
    }, [voiceTime]);

    useEffect(() => {
        //点击播放
        if(voiceBackPlay.status === 1){
            console.log("触发播放行为")
            // 点击播放就渲染当前的src 一般来说 首次渲染就会直接播放
            // 再强制播放

            if(backgroundAudioManager.src === undefined){
                console.log("触发 什么都没有的时候的声音",voiceList[0].voice)
                backgroundAudioManager.src = host+voiceList[0].voice
                backgroundAudioManager.webUrl = backVoice;
            }
            backgroundAudioManager.pause();
            backgroundAudioManager.play();
        }

        //点击暂停
        if(voiceBackPlay.status === 0){
            console.log("触发停止行为")
            //如果 src存在的话
            if(backgroundAudioManager.src !== undefined){
                backgroundAudioManager.pause()
            }
        }
    }, [voiceBackPlay]);

    useEffect(() => {
        if(sleepBackPlay.status === 1){
            console.log("触发助眠音乐播放行为")

            backgroundAudioManager.pause();
            backgroundAudioManager.play();
        }

        if(sleepBackPlay.status === 0){
            console.log("触发助眠音乐停止行为")
            //如果 src存在的话
            if(backgroundAudioManager.src !== undefined){
                backgroundAudioManager.pause()
            }
        }
    },[sleepBackPlay])

    useEffect(() => {
        if(breathBackPlay.status === 1){
            console.log("触发背景音乐播放行为")

            backgroundAudioManager.pause();
            backgroundAudioManager.play();
        }

        if(breathBackPlay.status === 0){
            console.log("触发背景音乐结束行为")
            if(backgroundAudioManager.src !== undefined){
                backgroundAudioManager.pause()
            }
        }
    }, [breathBackPlay]);


    return (
        <>
            <ConfigProvider
                theme={{
                    nutuiSearchbarBackground: '#FFFFFF',
                    nutuiSearchbarInputTextAlign: 'left',
                    nutuiSearchbarContentBackground: '#F8F8F8',
                    nutuiSearchbarPadding:'0rpx 0rpx',
                    nutuiSearchbarContentPadding:'0 28rpx',
                    nutuiSearchbarInputPadding:'0 28rpx',
                    nutuiSearchbarColor:'#BBBBBB',
                    nutuiSearchbarContentBorderRadius:'10rpx',
                    nutuiTabsTitlesPadding:'0 0 0 0',
                    nutuiTabsTitlesItemColor:'#666666',
                    nutuiRangeActiveColor:'#3cc65c',
                    nutuiPopupAnimationDuration:'0.3s',
                    nutuiTagPadding:'5px 13px',
                    nutuiTagFontSize:'15px',
                    nutuiButtonPrimaryFontWeight:600,
                }}
            >
                <View className={"outer-box"}>
                    <img src={backImg} className={"background-image"}/>
                    {/*{showBottomRound && (*/}
                    {/*    <View className={"header-box"}>*/}

                    {/*        <View className={"header-top"}>Hi，此时此刻</View>*/}
                    {/*        <View className={'header-mid'}>有时候，什么也不做是非常重要的</View>*/}
                    {/*        <View className={'header-bottom'}>- 此时此刻</View>*/}
                    {/*    </View>*/}
                    {/*)}*/}

                        <View className={"content-box"}>
                            {friendList.length > 0 && (
                            <View className={"content-text"}>
                                <View className={"text-up"}>{friendList[0].content}</View>
                                <View className={"text-down"}>-{friendList[0].author}</View>
                            </View>
                            )}
                            <View className={"content-icon"} onClick={() => jumpContact()}>
                                <View className={"icon-up"}><img className={"content-icon-img"} src={helpIcon}/></View>
                                <View className={"icon-down"}>同行互助</View>
                            </View>
                        </View>

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
                                {voiceBackPlay.status === 0?(
                                    <img className={"voice-center-img"} src={startIcon} onClick={() => setVoiceBackPlay({
                                        ...voiceBackPlay,
                                        'status':1,
                                    })}/>
                                ): (
                                    <img className={"voice-center-img"} src={stopIcon} onClick={() => setVoiceBackPlay({
                                        ...voiceBackPlay,
                                        'status':0,
                                    })}/>
                                )}
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
                                {sleepBackPlay.status === 0?(
                                    <img className={"sleep-center-img"} src={startIcon} onClick={() => setSleepBackPlay({
                                        ...sleepBackPlay,
                                        'status':1,
                                    })}/>
                                ): (
                                    <img className={"sleep-center-img"} src={stopIcon} onClick={() => setSleepBackPlay({
                                        ...sleepBackPlay,
                                        'status':0,
                                    })}/>
                                )}
                            </View>
                            <View className={"box-side-right"}  onClick={() => {
                                console.log("助眠分享")
                            }}>
                                <img className={"sleep-side-img"} src={sleepSetIcon}/>
                            </View>
                        </View>
                    )}


                    <img className={"outer-footer-call"} src={drawIcon} onClick={() => {
                        setShowBottomRound(true)
                    }}/>
                        {/*<img src={drawIcon} className={"call-draw-img"}/>*/}
                    {/*</View>*/}
                    <View className={"outer-footer-block"}></View>

                    <Popup duration={300} title={<View style={{color:'#666666'}}>定时停止</View>} visible={showVoiceSet} style={{height: '65%', border: "0px solid black"}}
                           lockScroll={true}
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


                    <Popup duration={300} title={<View style={{color:'#666666'}}>播放设置</View>} visible={showSleepSet} style={{height: '35%', border: "0px solid black"}}
                           lockScroll={true}
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

                    <Popup duration={300} closeable overlay={false}  title={<View style={{color:'#666666'}}>背景音乐</View>} visible={showSleepBackgroundVoice} style={{height: '85%', border: "0px solid black"}}
                           lockScroll={true}
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
                                {/*{sleepBackgroundList.length === 0 && (<View className={"empty-notice"}>抱歉，没有找到符合条件结果</View>)}*/}
                            </View>
                        </ScrollView>
                        </View>
                    </Popup>


                    {/*呼吸背景音乐*/}
                    <Popup duration={300} zIndex={2001} closeable overlay={false}  title={<View style={{color:'#666666'}}>背景音乐2</View>} visible={showBreathBackgroundVoice} style={{height: '88%', border: "0px solid black"}}
                           lockScroll={true}
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
                                    {/*{breathBackgroundList.length === 0 && (<View className={"empty-notice"}>抱歉，没有找到符合条件结果</View>)}*/}
                                </View>
                            </ScrollView>
                        </View>
                    </Popup>

                    {/*//呼吸模式PopUp*/}
                    <Popup duration={300} zIndex={2001} title={<View style={{color:'#666666'}}>呼吸时长</View>} visible={showBreathTimeSet} style={{height: '52%', border: "0px solid black"}}
                           lockScroll={true}
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
                    <Popup duration={300} zIndex={2001} title={<View style={{color:'#666666'}}>呼吸引导</View>} visible={showBreathVoiceSet} style={{height: '20%', border: "0px solid black"}}
                           lockScroll={true}
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

                    {/*//呼吸动效PopUp*/}
                    <Popup duration={300} zIndex={2001}  visible={showBreathDynamicSet} style={{width:"100%",height:"100%",border: "1px solid black"}}
                           lockScroll={true}
                           onClose={() => {
                        setShowBreathDynamicSet(false)
                    }}>
                        <View className={"breath-dynamic-box"} style={{backgroundImage: `url(${backImg})`}}>
                            <View className={"breath-mask"}>
                                <View className={"box-dynamic"}>
                                    <View className={"box-dynamic-text"}>{breathDynamicText}</View>

                                    {/*不是748 就是 444*/}
                                    {currentBreathItem.current_breath_type === 478 ? (
                                        <View className={"dynamic-circle" + (isAnimating478?" animate478 active":" animate478 paused")}>
                                        </View>
                                    ):(
                                        <View className={"dynamic-circle" +(isAnimating44?" animate44 active":" animate44 paused")}>
                                            {/*<View className={"box-dynamic-text"}>{breathDynamicText}</View>*/}
                                        </View>
                                    )}

                                </View>

                                <View className={"info-dynamic"}>
                                    配合数息法、肌肉放松法，助眠效果更好哦
                                </View>

                                <Button type="primary"  fill="outline" style={{background:"unset",margin:'308rpx 0 0 0'}}  color="#FFFFFF" size="large" onClick={() => handleBreathClose()}>
                                    结束
                                </Button>
                            </View>

                        </View>
                    </Popup>


                    {/*//主页面Popup*/}
                    <Popup duration={300} overlay={true} visible={showBottomRound} style={{height: '88%', border: "0px solid black"}}
                           lockScroll={true}
                           // overlayStyle={{'background':"rgba(0, 0, 0, 0.1)"}}

                           position={"bottom"} round onClose={() => {setShowBottomRound(false)}}>
                        <View className={"index-popup-inner-box"}>
                            <View
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                className={"pull-icon-box"} onClick={() => {
                                setShowBottomRound(false)
                            }}>
                                <Image className={"icon-draw"} width={"48rpx"} height={"20rpx"} src={drawPopIcon}/>
                            </View>

                            <View className={"search-box"}>
                                {searchMode ===1 ? (
                                    <SearchBar placeholder="搜索声音"
                                               onSearch={(value) => handleVoiceSearch(value)}
                                               onClear={() => handleVoiceClear()}
                                               onFocus={() => handleShowSearchPage()}
                                               value={searchFilterData.voice_name}
                                               // right={<View onClick={()=>{setSearchMode(0)}}>取消</View>}
                                               right={<View onClick={()=>handleSearchCancel()}>取消</View>}
                                    />
                                ):(
                                    <SearchBar placeholder="搜索声音"
                                    // onSearch={(value) => handleVoiceSearch(value)}
                                    // onClear={() => handleVoiceClear()}
                                    onFocus={() => handleShowSearchPage()}
                                    // value={searchFilterData.voice_name}
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
                                {/*<View className={"item-bottom-tabs"}>*/}

                                {/*</View>*/}
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
                                        {/*{voiceList.length === 0 && (<View className={"empty-notice"}>抱歉，没有找到符合条件结果</View>)}*/}
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
                                        <View className={"breath-type-item-box"+(breathTypeItem.type === 44 ? "-selected-44":"")} onClick={() => setBreathTypeItem({
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
                                        {/*<View className={"action-item"} onClick={() =>setShowBreathBackgroundVoice(true)}>*/}
                                        {/*    <View className={"item-up"}>*/}
                                        {/*        <View className={"up-left"}>{breathBackgroundItem.breath_background_name}</View>*/}
                                        {/*        <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>*/}
                                        {/*    </View>*/}
                                        {/*    <View className={"item-down"}>背景音乐</View>*/}
                                        {/*</View>*/}
                                    </View>
                                    <View className={"breath-bottom-box"}>
                                        <Button type="primary" fill="outline" color="#3cc65c" size="large" onClick={() => handleBreathStart()}>
                                            开始呼吸
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
