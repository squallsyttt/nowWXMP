import {View} from "@tarojs/components";
import NavCustomBar from "../../components/nav_bar_class";
import qrCodeImg from "../../assets/qrcode.png";
import './index.scss';
import {Image} from "@nutui/nutui-react-taro";

function Index() {
    return (
        <View className={"contact-out"}>
            <NavCustomBar
                needBackIcon={true}
                mainTitle={'同行互助'}
            />
            <View className={"contact-header"}>Hi:  此时此刻的你</View>
            <View className={"contact-content"}>
                很高兴，我们在这里相遇
                <View className={"divide"}></View>
                “此时此刻”小程序是我（一个长期重度失眠患者）在失眠7年后创建的；在与失眠斗争的过程中，我收获了一些治愈失眠的方法，内心也逐渐变得丰盈而平静，希望这些经验可以与你分享。
                <View className={"divide"}></View>
                此时此刻，你也许正在被失眠折磨着，你也许尝试了很多方法，但是效果并不好，那请加入同行互助群吧；在这个群里，我们将与众多失眠者一起，找到治愈失眠的方法。
                <View className={"divide"}></View>
                希望我们都能很快走出失眠，重获好梦。
            </View>
            <View className={"contact-bottom"}>
                <Image src={qrCodeImg} className={"bottom-img"} showMenuByLongpress={true}/>
            </View>
            <View className={"contact-notice"}>
                长按识别二维码
            </View>
        </View>
        )

}
export default Index