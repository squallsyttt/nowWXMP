import {View} from "@tarojs/components";
import "./index.scss";
import listenIcon from "../../assets/playcycle.png"

function BreathBackgroundVoiceItem(props) {
    const {title="",img="",listen=0,onClick} = props;

    const img_host = "https://www.csck.tech/";

    return (
        <View className={"breath-background-item-box"} onClick={onClick}>
            <View className={"background-item-top"}>
                {listen>0 && (<View className={"top-listen"}>
                    <img alt={"在听图标"} className={"listen-img"} src={listenIcon}/>
                </View>)}
                <img className="item-img" mode="aspectFill" src={img_host+img} alt="item-img"/>
            </View>
            <View className={"background-item-bottom"}>
                <View className={'bottom-title'}>{title}</View>
            </View>
        </View>
    )
}
export default BreathBackgroundVoiceItem