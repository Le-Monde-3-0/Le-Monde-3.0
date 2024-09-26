import 'dart:math';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:encrypt/encrypt.dart' as encrypt;

import 'package:lm3/src/models/user.dart';

import 'package:lm3/src/services/auth_service.dart';

import 'dart:convert';
import 'user_event.dart';
import 'user_state.dart';

class UserBloc extends Bloc<UserEvent, UserState> {
  final FlutterSecureStorage secureStorage;
  final AuthService _authService = AuthService();

  UserBloc(this.secureStorage) : super(UserInitial()) {
    on<UserLoginRequested>((event, emit) => _onLoginRequested(event, emit));
    on<UserLogin>((event, emit) => _onLogin(event, emit));
    // on<UserLogin>(_onLogin);

    on<GetUser>(_onGetUser);

    // on<UserLogout>((event, emit) async {
    //   // Clear the storage if necessary
    //   await secureStorage.delete(key: 'user');
    //   emit(state.copyWith(user: null));
    // });
  }

  Future<void> _onLogin(UserLogin event, Emitter<UserState> emit) async {
    emit(UserLoaded(event.user));
  }

  Future<void> _onLoginRequested(UserLoginRequested event, Emitter<UserState> emit) async {
    try {
      final UserModel user = await _authService.emailSignIn(event.identifier, event.password);
      final encryptedPassword = _encryptPassword(event.password);
      Map<String, dynamic> userToStore = user.toJson();
      userToStore['encryptedPassword'] = encryptedPassword;
      String userJson = jsonEncode(userToStore);
      final storage = FlutterSecureStorage();
      String? otherAccountsJson = await storage.read(key: 'otherAccounts');
      List<dynamic> otherAccounts = otherAccountsJson != null ? jsonDecode(otherAccountsJson) : [];
      otherAccounts.removeWhere((account) => account['email'] == user.email);
      otherAccounts.insert(0, userToStore);
      if (otherAccounts.length > 2) {
        otherAccounts = otherAccounts.sublist(0, 2);
      }
      await storage.write(key: 'otherAccounts', value: jsonEncode(otherAccounts));
      await storage.write(key: 'user', value: userJson);

      emit(UserLoaded(user));
    } catch (e) {
      print(e);
      emit(UserError(e.toString()));
    }
  }

  String _encryptPassword(String password) {
    try {
      final key = encrypt.Key.fromUtf8('1234567891011123');
      final iv = encrypt.IV.fromLength(16);
      final encrypter = encrypt.Encrypter(encrypt.AES(key));

      final encrypted = encrypter.encrypt(password, iv: iv);

      final encryptedWithIv = iv.base64 + encrypted.base64;

      print('Encrypted: $encryptedWithIv');
      return encryptedWithIv;
    } catch (e) {
      print(e);
      return '';
    }
  }

  Future<void> _onGetUser(GetUser event, Emitter<UserState> emit) async {
    emit(UserLoading());
    try {
      String? userJson = await secureStorage.read(key: 'user');
      if (userJson == null) {
        emit(const UserError('User not found'));
        return;
      }
      Map<String, dynamic> userMap = jsonDecode(userJson);
      final user = UserModel.fromJson(userMap);
      emit(UserLoaded(user));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}
