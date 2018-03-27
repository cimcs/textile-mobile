//  Created by react-native-create-bridge

#import "TextileIPFS.h"
#import <Mobile/Mobile.h>

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

@interface TextileIPFS()

@property (nonatomic, strong) MobileNode *node;

@end

@implementation TextileIPFS
@synthesize bridge = _bridge;

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

// Export constants
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#exporting-constants
- (NSDictionary *)constantsToExport
{
  return @{
           @"EXAMPLE": @"example"
           };
}

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html

RCT_EXPORT_METHOD(createNodeWithDataDir:(NSString *)dataDir apiHost:(NSString *)apiHost)
{
  [self _createNodeWithDataDir:dataDir apiHost:apiHost];
}

RCT_REMAP_METHOD(startNode, startNodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  BOOL success = [self _startNode:&error];
  if(success) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(stopNode, stopNodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  BOOL success = [self _stopNode:&error];
  if(success) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(peerId, peerIdWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *peerId = [self _peerId];
  if(peerId) {
    resolve(peerId);
  } else {
    NSError *error = [NSError errorWithDomain:@"ipfs" code:1 userInfo:nil];
    reject(@"nil_peer_id", @"Peer id is undefined", error);
  }
}

RCT_REMAP_METHOD(key, keyWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *key = [self _key];
  if(key) {
    resolve(key);
  } else {
    NSError *error = [NSError errorWithDomain:@"ipfs" code:2 userInfo:nil];
    reject(@"nil_key", @"Key is undefined", error);
  }
}

RCT_EXPORT_METHOD(addImageAtPath:(NSString *)path thumbPath:(NSString *)thumbPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  NSString *hash = [self _addPhoto:path thumbPath:thumbPath error:&error];
  if(hash) {
    resolve(hash);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotos:(NSString *)offset limit:(long)limit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *hashesString = [self _getPhotosFromOffset:offset withLimit:limit error:&error];
  if (hashesString) {
    resolve(hashesString);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotoData:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhoto:path error:&error];
  if (result) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(exampleMethod)
{
  [self emitMessageToRN:@"EXAMPLE_EVENT" :nil];
}

// List all your events here
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#sending-events-to-javascript
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"SampleEvent"];
}

#pragma mark - Private methods

- (void)_createNodeWithDataDir:(NSString *)dataDir apiHost:(NSString *)apiHost {
  self.node = MobileNewTextile(dataDir, apiHost);
}

- (BOOL)_startNode:(NSError**)error {
  BOOL success = [self.node start:error];
  return success;
}

- (BOOL)_stopNode:(NSError**)error {
  BOOL success = [self.node stop:error];
  return success;
}

- (NSString *)_peerId {
  return @"somepeerid";
}

- (NSString *)_key {
  return @"thisissomekey";
}

- (NSString *)_addPhoto:(NSString *)path thumbPath:(NSString *)thumbPath error:(NSError**)error {
  NSString *hash = [self.node addPhoto:path thumb:thumbPath error:error];
  return hash;
}

- (NSString *)_getPhotosFromOffset:(NSString *)offset withLimit:(long)limit error:(NSError**)error {
  NSString *hashesString = [self.node getPhotos:offset limit:limit error:error];
  return hashesString;
}

- (NSString *)_getPhoto:(NSString *)hashPath error:(NSError**)error {
  NSString *base64String = [self.node getPhotoBase64String:hashPath error:error];
  return base64String;
}

// Implement methods that you want to export to the native module
- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self sendEventWithName: eventName body: params];
}

@end