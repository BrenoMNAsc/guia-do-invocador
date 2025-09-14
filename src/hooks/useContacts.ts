import * as Contacts from "expo-contacts";
import { useCallback, useEffect, useState } from "react";
import { Share, Linking } from "react-native";

export function useContacts() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Contacts.Contact[]>([]);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          fields: [
            Contacts.Fields.Name,
            Contacts.Fields.Emails,
            Contacts.Fields.PhoneNumbers,
          ],
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

  const share = useCallback(async (message: string) => {
    try {
      await Share.share({ message });
      return true;
    } catch {
      return false;
    }
  }, []);

  const shareToContact = useCallback(
    async (
      contact: Contacts.Contact,
      message: string,
      subject = "Build LoL"
    ) => {
      const email = contact.emails?.[0]?.email;
      const phone = contact.phoneNumbers?.[0]?.number;
      const body = encodeURIComponent(message);
      if (email) {
        const subj = encodeURIComponent(subject);
        const url = `mailto:${email}?subject=${subj}&body=${body}`;
        try {
          const can = await Linking.canOpenURL(url);
          if (can) {
            await Linking.openURL(url);
            return true;
          }
        } catch {}
      }
      if (phone) {
        const url = `sms:${phone}?body=${body}`;
        try {
          const can = await Linking.canOpenURL(url);
          if (can) {
            await Linking.openURL(url);
            return true;
          }
        } catch {}
      }
      return false;
    },
    []
  );

  return { loading, data, denied, error, share, shareToContact };
}
