import * as React from "react";
import * as Contacts from "expo-contacts";

export function useContacts() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Contacts.Contact[]>([]);
  const [denied, setDenied] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        setDenied(true);
        setLoading(false);
        return;
      }
      const res = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.Emails],
      });
      setData(res.data);
      setLoading(false);
    })();
  }, []);

  return { loading, data, denied };
}
