
import { Button, Tailwind } from '@react-email/components';

type EmailTemplateProps = {
  titleNewsletter: string;
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  titleNewsletter,
}) => (
  <Tailwind>
    <h1>Welcome to {titleNewsletter} new newsLatter!!</h1>
    <div className="mt-3">
      <p className="text-slate-500">
        We have just attach a file realate to newslatter info
      </p>
    </div>
    <Button
      className="bg-blue-500 px-3 py-2 font-medium leading-4 text-white rounded-md"
      type="button"
    >
      Please sign in
    </Button>
  </Tailwind>
);
