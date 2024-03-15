import React, {useEffect, useState} from 'react'
import {ScrollView, View} from '@tarojs/components'
import {Button, Cell, ConfigProvider, Image, Popup, Range, SearchBar, Tabs} from "@nutui/nutui-react-taro"
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

import VoiceItem from "../../components/voice";
import SleepItem from "../../components/sleep";
import voice from "../../components/voice";
import Taro from '@tarojs/taro';
import BreathBackgroundVoiceItem from "../../components/breath";

function Index() {
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

    const [sleepBackgroundList,setSleepBackgroundList] = useState([]);

    const [backImg,setBackImg] = useState("http://now.local.com/uploads/20240309/cdaab7bd3b54da36b944c218e761d0c4.jpg")
    const [backAudio,setBackAudio] = useState("http://now.local.com/uploads/20240309/c1461b2fd88d44a29922b9410eaf9747.mp3")
    const [backTitle,setBackTitle] = useState("")
    const [friendList,setFriendList] = useState([]);

    //1声音模式 2睡眠模式 3呼吸模式
    const [appMode,setAppMode] = useState(2);

    //默认是一直循环的
    const [voiceTime,setVoiceTime] = useState(999)

    //弹框默认是开启的
    const [showBottomRound,setShowBottomRound] = useState(true)

    //声音的设置popUp
    const [showVoiceSet,setShowVoiceSet] = useState(false)
    //助眠的设置popUp
    const [showSleepSet,setShowSleepSet] = useState(false)

    // 呼吸时间滑动选择的PopUp 不设置遮罩 切换到breath就打开 切走就关闭
    const [showBreathTimeSet,setShowBreathTimeSet] = useState(true)
    // 呼吸那个44 478的设置
    const [showBreathTypeSet,setShowBreathTypeSet] = useState(false)
    // 女声 男声 音效的设置
    const [showBreathVoiceSet,setShowBreathVoiceSet] = useState(false)

    //助眠背景音乐选择
    const [showSleepBackgroundVoice,setShowSleepBackgroundVoice] = useState(false)

    //助眠设置的背景音乐Item
    const [sleepBreathBackgroundItem,setSleepBreathBackgroundItem] = useState({
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
      'type_id': 1,
      'page': 1,
      'voice_name':'',
    });

    const [sleepFilterData,setSleepFilterData] = useState({
        'page': 1,
    })

    const [sleepBackgroundFilterData,setSleepBackgroundFilterData] = useState({
        'page': 1,
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

    const handleScrollLowerVoice = () => {
        setFilterData((prevFilterData) =>({
            ...prevFilterData,
            'page':prevFilterData.page + 1,
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
    }

    const handleSleepItemClick = (item) => {
        console.log("sleepItem",item)
        setAppMode(2);
        setBackImg(host+item.sleep_background_img)
        setBackTitle(item.sleep_name)
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

    const handleScrollLowerSleepBackgroundVoice = () => {
        console.log(666)
        setSleepBackgroundFilterData((prevSleepBackgroundFilterData) =>({
            ...prevSleepBackgroundFilterData,
            'page':prevSleepBackgroundFilterData.page + 1,
        }));
    }

    const fetchFriendData = () => {
        return request("nowvoice/getFriendList")
    }

    const fetchIndexData = ()=>{
      return request("nowvoice/index",filterData);
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

    const handleVoiceSearch= (value) =>{
        setFilterData((prevFilterData) => ({
            ...prevFilterData,
            'page': 1,
            'voice_name': value,
        }));
    }

    const handleVoiceClear = ()=>{
        setFilterData((prevFilterData) => ({
            ...prevFilterData,
            'voice_name': "",
            'page':1,
        }));
    }

    const handleVoiceTimeSet = (value)=>{
        setVoiceTime(value)
    }

    const handleBreathTypeSet = (value)=>{
        console.log("handleBreathType")
        if(value === 478){
            setBreathTypeItem({
                'type_name':'4-7-8呼吸',
                'type':478,
            });
        }
        if(value === 44){
            setBreathTypeItem({
                'type_name':'4x4箱式呼吸',
                'type':44,
            })
        }
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
    }, []);

    useEffect(() => {
        // console.log('voiceTypeList',{voiceTypeList})
        // console.log('voiceList',{voiceList})
        // console.log('countList',{countList})
        // console.log('friendList',friendList);
        console.log("sleepBackgroundList",sleepBackgroundList)
    }, [voiceList,voiceTypeList,countList,friendList,sleepBackgroundList]);

    //页面上的筛选项变化后 请求借口去更新页面数据
    useEffect(() => {
        fetchIndexData().then((data)=>{
            // console.log("voiceData on filterData Changed",data)
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

        console.log('filterData',filterData)
    }, [filterData]);

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
                }}
            >
                <View className={"outer-box"}>
                    <img src={backImg} className={"background-image"}/>
                    {showBottomRound && (
                        <View className={"header-box"}>

                            <View className={"header-top"}>Hi，此时此刻</View>
                            <View className={'header-mid'}>有时候，什么也不做是非常重要的</View>
                            <view className={'header-bottom'}>- 此时此刻</view>
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
                            <View className={"box-side-left"}>
                                <img className={"voice-side-img"} src={unstarIcon}/>
                            </View>
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
                            <View className={"box-side-left"}>
                                <img className={"sleep-side-img"} src={unstarIcon}/>
                            </View>
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

                    <Popup title={<View style={{color:'#666666'}}>定时停止</View>} visible={showVoiceSet} style={{height: '65%', border: "0px solid black"}}
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


                    <Popup title={<View style={{color:'#666666'}}>播放设置</View>} visible={showSleepSet} style={{height: '35%', border: "0px solid black"}}
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
                                <View className={"item-left"}>背景声音</View>
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

                    <Popup closeable overlay={false}  title={<View style={{color:'#666666'}}>背景音乐</View>} visible={showSleepBackgroundVoice} style={{height: '85%', border: "0px solid black"}}
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

                    {/*//呼吸模式PopUp*/}
                    <Popup zIndex={2001} title={<View style={{color:'#666666'}}>呼吸模式</View>} visible={showBreathTypeSet} style={{height: '28%', border: "0px solid black"}}
                           position={"bottom"} round onClose={() => {
                        setShowBreathTypeSet(false)
                    }}>
                        <View className={"breath-type-set-box"}>
                            <View className={"breath-type-item"} onClick={() => handleBreathTypeSet(478)}>
                                <img className={"item-icon"} src={breathIcon478}/>
                                <View className={"item-left"}>
                                    <View className={"left-up"}>4-7-8呼吸</View>
                                    <View className={"left-down"}>神经系统的天然镇静剂</View>
                                </View>
                                {breathTypeItem.type === 478 && (<View className={"item-right"}><img className={"right-img"}
                                                                                         src={voiceTimeCheckIcon}/></View>)}
                            </View>
                            <View className={"breath-type-item"} onClick={() => handleBreathTypeSet(44)}>
                                <img className={"item-icon"} src={breathIcon44}/>
                                <View className={"item-left"}>
                                    <View className={"left-up"}>4x4箱式呼吸</View>
                                    <View className={"left-down"}>一种深度放松技术</View>
                                </View>
                                {breathTypeItem.type === 44 && (<View className={"item-right"}><img className={"right-img"} src={voiceTimeCheckIcon}/></View>)}
                            </View>
                        </View>
                    </Popup>

                    {/*//呼吸引导PopUp*/}
                    <Popup zIndex={2001} title={<View style={{color:'#666666'}}>呼吸引导</View>} visible={showBreathVoiceSet} style={{height: '20%', border: "0px solid black"}}
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
                    <Popup overlay={false} visible={showBottomRound} style={{height: '88%', border: "0px solid black"}}
                           position={"bottom"} round onClose={() => {
                        setShowBottomRound(false)
                    }}>
                        <View className={"index-popup-inner-box"}>
                            <View className={"pull-icon"} onClick={() => {
                                setShowBottomRound(false)
                            }}>
                                <Image width={"40rpx"} height={"30rpx"} src={drawIcon}/>
                            </View>
                            <View className={"search-box"}>
                                <SearchBar placeholder="搜索声音"
                                           onSearch={(value) => handleVoiceSearch(value)}
                                           onClear={() => handleVoiceClear()}
                                />

                            </View>
                            {/*<View className={"tabs-up-box"}>*/}
                            {/*    222用于放count数*/}
                            {/*</View>*/}

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
                                                    />
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>

                            </View>)}
                            {activeTab === 2 && (<View className={"tabs-item-bottom"}>
                                <View className={"bottom-single-page"}>
                                    <View className={"select-breath-duration"}>滑动选择 duration</View>
                                    <View className={"mid-breath-action-box"}>
                                        <View className={"action-item"} onClick={() => setShowBreathTypeSet(true)}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>{breathTypeItem.type_name}</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down"}>呼吸模式</View>
                                        </View>
                                        <View className={"action-item"} onClick={() => setShowBreathVoiceSet(true)}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>{breathVoiceItem.voice_name}</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down"}>呼吸引导</View>
                                        </View>
                                        <View className={"action-item"}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>背景音乐</View>
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


                            {/*<View className={"tabs-item-box"}>*/}

                            {/*</View>*/}


                        </View>
                    </Popup>
                </View>
            </ConfigProvider>
        </>

  )
}

export default Index
