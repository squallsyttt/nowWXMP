import React, {useEffect, useState} from 'react'
import { View } from '@tarojs/components'
import { Button } from "@nutui/nutui-react-taro"
import './index.scss'
import {request} from "../../utils/api";

function Index() {
    const [tabValue,setTabValue] = useState(1);
    const [indexPage,setIndexPage] = useState(1);
    const [voiceName,setVoiceName] = useState("");

    const [filterData,setFilterData] =useState({
      'type_id': '',
      'page': 1,
      'voice_name':'',
    });
    
    const fetchIndexData = ()=>{
      return request("/now/nowvoice/index",filterData);
    }

  useEffect(() => {
    fetchIndexData().then((data) => {
      console.log(data)
    })
  }, []);

    return (
       123
  )
}

export default Index
