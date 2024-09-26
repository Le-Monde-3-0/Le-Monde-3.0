import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:encrypt/encrypt.dart' as encrypt;

import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:lm3/src/bloc/user/user_event.dart';
import 'package:lm3/src/bloc/user/user_state.dart';

import 'package:flutter/foundation.dart';


class AccountSelectorWidget extends StatelessWidget {
  const AccountSelectorWidget({Key? key}) : super(key: key);

  Future<List<Map<String, dynamic>>> _getOtherAccounts() async {
    final storage = FlutterSecureStorage();
    String? otherAccountsJson = await storage.read(key: 'otherAccounts');
    if (otherAccountsJson != null) {
      List<dynamic> accounts = jsonDecode(otherAccountsJson);
      return List<Map<String, dynamic>>.from(accounts);
    }
    return [];
  }

  Future<void> _removeAccount(int index) async {
    final storage = FlutterSecureStorage();
    String? otherAccountsJson = await storage.read(key: 'otherAccounts');
    if (otherAccountsJson != null) {
      List<dynamic> accounts = jsonDecode(otherAccountsJson);
      accounts.removeAt(index); // Supprime l'utilisateur à l'index donné

      // Sauvegarde la liste mise à jour dans SecureStorage
      await storage.write(key: 'otherAccounts', value: jsonEncode(accounts));
    }
  }

String _decryptPassword(String encryptedPassword) {
  try {
    final key = encrypt.Key.fromUtf8('1234567891011123'); // Same key used for encryption

    // Extract the IV and the encrypted text
    final ivBase64 = encryptedPassword.substring(0, 24); // IV is 16 bytes, base64 encoded = 24 characters
    final encryptedTextBase64 = encryptedPassword.substring(24); // The rest is the encrypted text

    final iv = encrypt.IV.fromBase64(ivBase64); // Re-create the IV
    final encrypter = encrypt.Encrypter(encrypt.AES(key));

    final decrypted = encrypter.decrypt64(encryptedTextBase64, iv: iv);

    print('Decrypted: $decrypted');
    return decrypted;
  } catch (e) {
    print(e);
    return '';
  }
}


  void _onAccountSelected(BuildContext context, Map<String, dynamic> account) {
    print('Selected account: ${account['email']}');
    print(account);
    String decryptedPassword = _decryptPassword(account['encryptedPassword']);
    // print('Decrypted password: $decryptedPassword');

    context.read<UserBloc>().add(UserLoginRequested(account['email'], decryptedPassword));
    Navigator.of(context).pop(); // Ferme la boîte modale
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () async {
        List<Map<String, dynamic>> accounts = await _getOtherAccounts();
        if (accounts.isNotEmpty) {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: const Text('Choisir un autre compte'),
                content: SizedBox(
                  width: double.maxFinite,
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: accounts.length,
                    itemBuilder: (BuildContext context, int index) {
                      final account = accounts[index];
                      return ListTile(
                        title: Text(account['email']),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () async {
                            // Supprime l'utilisateur à l'index donné
                            await _removeAccount(index);
                            Navigator.of(context).pop(); // Ferme la boîte modale
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Compte supprimé')),
                            );
                          },
                        ),
                        onTap: () => _onAccountSelected(context, account),
                      );
                    },
                  ),
                ),
                actions: <Widget>[
                  TextButton(
                    child: const Text('Cancel'),
                    onPressed: () {
                      Navigator.of(context).pop(); // Ferme la boîte modale
                    },
                  ),
                ],
              );
            },
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Aucun autre compte enregistré')),
          );
        }
      },
      child: const Text('Selectionner un compte'),
    );
  }
}