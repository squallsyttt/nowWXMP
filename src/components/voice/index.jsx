import {View} from "@tarojs/components";
import "./index.scss";
import {Image} from "@nutui/nutui-react-taro";
import listenIcon from '../../assets/listen.png';

function VoiceItem(props) {
    const {title="",like="",img="",type="voice"} = props;

    const img_host = "http://now.local.com/";

    return (
        <View className={"voice-item-box"}>
            <View className={"voice-item-top"}>
                <View className={"top-like"}>

                </View>
                <img className="item-img" mode="aspectFill" src={img_host+img} alt="item-img"/>
            </View>
            <View className={"voice-item-bottom"}>
                <View className={'bottom-title'}>{title}</View>
                <View className={'bottom-info'}>
                    <Image width={"24rpx"} height={"24rpx"} src={listenIcon}/>
                    {like+"人在听"}
                </View>
            </View>
        </View>
    )
}
export default VoiceItem