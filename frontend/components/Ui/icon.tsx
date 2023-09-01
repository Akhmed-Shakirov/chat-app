export default function Icon(props: { icon?: any; deg?: any; }) {
    return (
        <>
            <i className={`icon${props?.icon ? ' ' + props?.icon : ''}${props?.deg ? ' ' + props?.deg : ''}`} />
        </>
    )
}
