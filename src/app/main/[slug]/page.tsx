export default function TrackDetail({ params }: { params: { slug: string } }) {
    return (
        <div className='min-h-screen w-screen sm:w-[430px]'>{params.slug}</div>
    );
}
