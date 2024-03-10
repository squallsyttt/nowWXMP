import React, {useEffect, useState} from 'react'
import {ScrollView, View} from '@tarojs/components'
import {Button, Cell, ConfigProvider, Image, Popup, SearchBar, Tabs} from "@nutui/nutui-react-taro"
import './index.scss'
import {request} from "../../utils/api";
import drawIcon from '../../assets/draw.png';
import VoiceItem from "../../components/voice";
import SleepItem from "../../components/sleep";

function Index() {
    const [tabValue,setTabValue] = useState(0);
    const [voiceTabValue,setVoiceTabValue] = useState(0);
    const [indexPage,setIndexPage] = useState(1);
    const [voiceName,setVoiceName] = useState("");
    const [voiceTypeList,setVoiceTypeList] = useState([]);
    const [voiceList,setVoiceList] = useState([]);
    const [sleepList,setSleepList] = useState([]);
    const [activeTab,setActiveTab] = useState(0);
    const [countList,setCountList] = useState([]);

    //弹框默认是开启的
    const [showBottomRound,setShowBottomRound] = useState(true)

    const [filterData,setFilterData] =useState({
      'type_id': '',
      'page': 1,
      'voice_name':'',
    });

    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    const handleScrollUp = () => {
        console.log("scroll up");
    }

    const handleScrollLower = () => {
        console.log("scroll lower");
        setFilterData((prevFilterData) =>({
            ...prevFilterData,
            'page':prevFilterData.page + 1,
        }));
    }

    const fetchIndexData = ()=>{
      return request("/now/nowvoice/index",filterData);
    }

    const fetchVoiceType = () =>{
        return request("/now/nowvoice/voiceTypeList");
    }

    const fetchCountList = () =>{
        return request("/now/nowvoice/countList");
    }

    const fetchSleepData = () =>{
        return request("/now/nowsleep/index");
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
        console.log('voiceTypeList',{voiceTypeList})
        console.log('voiceList',{voiceList})
        console.log('countList',{countList})
    }, [voiceList,voiceTypeList,countList]);

    //页面上的筛选项变化后 请求借口去更新页面数据
    useEffect(() => {
        fetchIndexData().then((data)=>{
            setVoiceList(data.list)
        })
    }, [filterData]);

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
                    <View class={"outer-footer-call"} onClick={()=>{setShowBottomRound(true)}}>

                    </View>
                    <Popup visible={showBottomRound} style={{height:'95%',border:"0px solid black"}} position={"bottom"} round onClose={()=>{setShowBottomRound(false)}}>
                        <View className={"index-popup-inner-box"}>
                            <View className={"pull-icon"} onClick={()=>{setShowBottomRound(false)}} >
                                <Image width={"40rpx"} height={"30rpx"} src={drawIcon}/>
                            </View>
                            <View className={"search-box"}>
                                <SearchBar placeholder="搜索声音" />
                            </View>
                            {/*<View className={"tabs-up-box"}>*/}
                            {/*    222用于放count数*/}
                            {/*</View>*/}

                            <View className={"tabs-box"}>
                                <View className={`tabs-item ${activeTab === 0 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(0)}>声音{activeTab === 0 && <span className="badge">{countList.voiceCount}</span>}</View>
                                <View className={`tabs-item ${activeTab === 1 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(1)}>助眠{activeTab === 1 && <span className="badge">{countList.sleepCount}</span>}</View>
                                <View className={`tabs-item ${activeTab === 2 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(2)}>呼吸</View>
                            </View>

                            {activeTab === 0 &&(<View className={"tabs-item-bottom"}>
                                <Tabs value={tabValue}
                                      align={"left"}
                                      tabStyle={{width: '664rpx',background:'#FFFFFF'}}
                                      activeType="button"
                                      activeColor={"#FFFFFF"}
                                      onChange={(value) => {
                                          console.log("Tabs Onchange value",value)
                                          setTabValue(value)
                                          setFilterData((prevFilterData) =>({
                                              ...prevFilterData,
                                              'type_id':voiceTypeList[value].type_id,
                                          }));
                                      }
                                      }>
                                    {Object.keys(voiceTypeList).map((key) =>(
                                        <Tabs.TabPane title={voiceTypeList[key].type_name}>
                                        </Tabs.TabPane>
                                    ))}
                                </Tabs>
                                <ScrollView
                                    className={"voice-scroll"}
                                    scrollY
                                    scrollWithAnimation
                                    scrollTop={0}
                                    // style={{ height: '100%' }}
                                    lowerThreshold={20}
                                    upperThreshold={20}
                                    // onScrollToUpper={handleScrollUp}
                                    // onScrollToLower={handleScrollLower}
                                >
                                    <View className={"bottom-single-page-voice"}>
                                        {Object.keys(voiceList).map((key) =>(
                                            <VoiceItem
                                                title={voiceList[key].voice_name}
                                                img={voiceList[key].background_img}
                                                like={voiceList[key].voice_listen_num}
                                            ></VoiceItem>
                                        ))}
                                    </View>
                                </ScrollView>

                            </View>)}
                            {activeTab === 1 &&(<View className={"tabs-item-bottom"}>
                                <View className={"bottom-single-page"}>
                                    {Object.keys(sleepList).map((key) =>(
                                        <SleepItem
                                            title={sleepList[key].sleep_name}
                                            img={sleepList[key].sleep_background_img}
                                            like={sleepList[key].sleep_listen_num}
                                        ></SleepItem>
                                    ))}
                                </View>
                            </View>)}
                            {activeTab === 2 &&(<View className={"tabs-item-bottom"}>
                                <View className={"bottom-single-page"}>
                                    <VoiceItem></VoiceItem>
                                    <VoiceItem></VoiceItem>
                                    <VoiceItem></VoiceItem>
                                    <VoiceItem></VoiceItem>
                                    <VoiceItem></VoiceItem>
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
