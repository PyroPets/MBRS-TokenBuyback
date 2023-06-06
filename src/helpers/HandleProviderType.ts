import ProviderDefault from "@/config/ProviderDefault";
import LocalProvider from "@/provider/LocalProvider";
import { APIProvider, NetworkType } from "@metrixcoin/metrilib";

export default function HandleProviderType(network: NetworkType) {
    let provider;
    if (network == 'MainNet' && ProviderDefault.type == "rpc") {
        provider = new LocalProvider(network);
      } else {
        provider = new APIProvider(network);
    }
    return provider;
}