import React, {useEffect, useState} from 'react'
import {ScrollView, View} from '@tarojs/components'
import {Button, Cell, ConfigProvider, Image, Popup, SearchBar, Tabs} from "@nutui/nutui-react-taro"
import './index.scss'
import {request} from "../../utils/api";
import drawIcon from '../../assets/draw.png';
import listenIcon from '../../assets/listen.png';
import rightIcon from '../../assets/right.png';
import VoiceItem from "../../components/voice";
import SleepItem from "../../components/sleep";
import voice from "../../components/voice";
import Taro from '@tarojs/taro';

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

    const [backImg,setBackImg] = useState("http://now.local.com/uploads/20240309/cdaab7bd3b54da36b944c218e761d0c4.jpg")
    const [backAudio,setBackAudio] = useState("http://now.local.com/uploads/20240309/c1461b2fd88d44a29922b9410eaf9747.mp3")

    const [friendList,setFriendList] = useState([]);

    //弹框默认是开启的
    const [showBottomRound,setShowBottomRound] = useState(true)

    const [filterData,setFilterData] =useState({
      'type_id': 1,
      'page': 1,
      'voice_name':'',
    });

    const [sleepFilterData,setSleepFilterData] = useState({
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
        setBackImg(host+item.background_img)
    }

    const handleSleepItemClick = (item) => {
        console.log("sleepItem",item)
        setBackImg(host+item.sleep_background_img)
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
    }, []);

    useEffect(() => {
        // console.log('voiceTypeList',{voiceTypeList})
        console.log('voiceList',{voiceList})
        // console.log('countList',{countList})
        // console.log('friendList',friendList);
    }, [voiceList,voiceTypeList,countList,friendList]);

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
                if(filterData.voice_name){
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
                                <View className={"icon-up"}><img className={"content-icon-img"} src={listenIcon}/></View>
                                <View className={"icon-down"}>同行互助</View>
                            </View>
                        </View>
                    )}

                    <View class={"outer-footer-call"} onClick={() => {
                        setShowBottomRound(true)
                    }}>
                        <img src={drawIcon} className={"call-draw-img"}/>
                    </View>
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
                                      onClick={() => handleTabClick(0)}>声音{activeTab === 0 &&
                                    <span className="badge">{countList.voiceCount}</span>}</View>
                                <View className={`tabs-item ${activeTab === 1 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(1)}>助眠{activeTab === 1 &&
                                    <span className="badge">{countList.sleepCount}</span>}</View>
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
                                        <View className={"action-item"}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>11</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down"}>呼吸模式</View>
                                        </View>
                                        <View className={"action-item"}>
                                            <View className={"item-up"}>
                                                <View className={"up-left"}>22</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down"}>呼吸引导</View>
                                        </View>
                                        <View className={"action-item-last"}>
                                            <View className={"item-up-last"}>
                                                <View className={"up-left"}>33</View>
                                                <View className={"up-right"}><img className={"breath-right"} src={rightIcon}/></View>
                                            </View>
                                            <View className={"item-down-last"}>背景音乐</View>
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
