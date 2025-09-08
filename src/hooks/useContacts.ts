import * as React from "react";
import * as Contacts from "expo-contacts";

export function useContacts() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Contacts.Contact[]>([]);
  const [denied, setDenied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== "granted") {
          if (active) {
            setDenied(true);
            setLoading(false);
          }
          return;
        }
        const res = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.Emails],
        });
        if (active) setData(res.data);
      } catch (e: any) {
        if (active) setError(e?.message ?? "Erro ao ler contatos");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { loading, data, denied, error };
}
