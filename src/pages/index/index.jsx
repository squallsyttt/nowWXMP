import React, {useEffect, useState} from 'react'
import { View } from '@tarojs/components'
import {Button, Cell, ConfigProvider, Image, Popup, SearchBar, Tabs} from "@nutui/nutui-react-taro"
import './index.scss'
import {request} from "../../utils/api";
import drawIcon from '../../assets/draw.png';

function Index() {
    const [tabValue,setTabValue] = useState(0);
    const [voiceTabValue,setVoiceTabValue] = useState(0);
    const [indexPage,setIndexPage] = useState(1);
    const [voiceName,setVoiceName] = useState("");
    const [voiceTypeList,setVoiceTypeList] = useState([]);
    const [voiceList,setVoiceList] = useState([]);
    const [activeTab,setActiveTab] = useState(0);

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

    const fetchIndexData = ()=>{
      return request("/now/nowvoice/index",filterData);
    }

    const fetchVoiceType = () =>{
        return request("/now/nowvoice/voiceTypeList");
    }

    useEffect(() => {
        fetchIndexData().then((data) => {
            setVoiceList(data.list)
        })
        fetchVoiceType().then((data) => {
            setVoiceTypeList(data.list)
        })
    }, []);

    useEffect(() => {
        console.log('voiceTypeList',{voiceTypeList})
        console.log('voiceList',{voiceList})
    }, [voiceList,voiceTypeList]);

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
                                      onClick={() => handleTabClick(0)}>声音{activeTab === 0 && <span className="badge">267</span>}</View>
                                <View className={`tabs-item ${activeTab === 1 ? 'active' : ''}`}
                                      onClick={() => handleTabClick(1)}>助眠{activeTab === 1 && <span className="badge">267</span>}</View>
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
                                          setTabValue(value)}
                                      }>
                                    <Tabs.TabPane title="声音">
                                    </Tabs.TabPane>
                                    <Tabs.TabPane title="助眠">
                                    </Tabs.TabPane>
                                    <Tabs.TabPane title="呼吸1">
                                    </Tabs.TabPane>
                                    <Tabs.TabPane title="呼吸2">
                                    </Tabs.TabPane>
                                    <Tabs.TabPane title="呼吸3">
                                    </Tabs.TabPane>
                                    <Tabs.TabPane title="呼吸4">
                                    </Tabs.TabPane>
                                    <Tabs.TabPane title="呼吸5">
                                    </Tabs.TabPane>
                                </Tabs>
                            </View>)}
                            {activeTab === 1 &&(<View className={"tabs-item-bottom"}>
                                222
                            </View>)}
                            {activeTab === 2 &&(<View className={"tabs-item-bottom"}>
                                333
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
