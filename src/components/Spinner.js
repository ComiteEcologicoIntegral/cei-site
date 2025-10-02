import { TailSpin } from "react-loader-spinner";

function Spinner({height}) {
  return <TailSpin
    height={height}
    width={height}
    color="#4fa94d"
    ariaLabel="tail-spin-loading"
    radius="1"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />
}

export default Spinner;
