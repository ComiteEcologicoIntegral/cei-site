function Loading(props) {
    return (
        <div className="text-center">
            <img
            src="loading.gif"
            alt="Cargando..."
            class={props.class}
            />
      </div>
    )
}
export default Loading;