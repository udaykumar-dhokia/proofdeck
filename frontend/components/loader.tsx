import { IconQuote } from '@tabler/icons-react';

const Loader = () => {
    return <>
        <div className="min-h-screen flex flex-col justify-center items-center">
            <IconQuote className='animate-blink' />
        </div>
    </>
}

export default Loader