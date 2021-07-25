import { Typography } from "@material-ui/core";
import Speech from "./Speech";

export default function Count(props) {
    return (
        <Speech {...props}>
            <Typography>
                When you are ready, press the button below to commence recording, and <strong>start counting out loud</strong> from one clearly at a fast but comfortable speaking pace until the timer runs out.
            </Typography>
        </Speech>
    )
}
