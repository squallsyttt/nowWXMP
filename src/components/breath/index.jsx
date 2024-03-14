import {View} from "@tarojs/components";
import "./index.scss";

function BreathBackgroundVoiceItem(props) {
    const {title="",img="",onClick} = props;

    const img_host = "http://now.local.com/";

    return (
        <View className={"breath-background-item-box"} onClick={onClick}>
            <View className={"background-item-top"}>
                <View className={"top-like"}>

                </View>
                <img className="item-img" mode="aspectFill" src={img_host+img} alt="item-img"/>
            </View>
            <View className={"background-item-bottom"}>
                <View className={'bottom-title'}>{title}</View>
            </View>
        </View>
    )
}
export default BreathBackgroundVoiceItem