import React, {useEffect, useState} from 'react'
import {ScrollView, View} from '@tarojs/components'
import {Button, Cell, ConfigProvider, Image, Popup, SearchBar, Tabs} from "@nutui/nutui-react-taro"
import './index.scss'
import {request} from "../../utils/api";
import drawIcon from '../../assets/draw.png';
import VoiceItem from "../../components/voice";
import SleepItem from "../../components/sleep";
import voice from "../../components/voice";

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

    const fetchIndexData = ()=>{
      return request("/now/nowvoice/index",filterData);
    }

    const fetchVoiceType = () =>{
        return request("/now/nowvoice/voiceTypeList",sleepFilterData);
    }

    const fetchCountList = () =>{
        return request("/now/nowvoice/countList");
    }

    const fetchSleepData = () =>{
        return request("/now/nowsleep/index",sleepFilterData);
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
    }, []);

    useEffect(() => {
        // console.log('voiceTypeList',{voiceTypeList})
        console.log('voiceList',{voiceList})
        // console.log('countList',{countList})
    }, [voiceList,voiceTypeList,countList]);

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
                                <SearchBar placeholder="搜索声音"/>
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
                                        {
                                            voiceList.map((item) => {
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
                                    111
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
